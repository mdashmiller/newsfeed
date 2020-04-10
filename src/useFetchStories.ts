import { useReducer, useCallback } from 'react'
import axios from 'axios'
import { headlinesFetchReducer, headlinesInitialState } from './headlinesFetchReducer'

const SINGLE_STORY_URL = 'https://hacker-news.firebaseio.com/v0/item/'

interface Story {
  id: number,
  title: string | null,
  url?: string
}

export const useFetchStories = (listOfStoryIds: number[]) => {
  const [
    { 
      storyData, 
      totalStoriesRequested,
      loadingStories, 
      loadingStoriesError, 
      endOfIdsList
    }
    ,dispatch
  ] = useReducer(headlinesFetchReducer, headlinesInitialState)

  // use listOfStoryIds to fetch data for the next 50 stories any
  // time the getMoreHeadlines element is in the viewport
  const fetchStories: IntersectionObserverCallback = useCallback(async (entries: IntersectionObserverEntry[]) => {
    // set getMoreHeadlines element as target
    const target = entries[0]

    if (target.isIntersecting) {
      // this section loops through the next 50 story ids and makes
      // a get req for the individual story data for each id
      dispatch({ type: 'FETCH_STORIES_INIT' })
      // create an array to hold the individual story data
      // response objects so when the loop completes they
      // can be set in state with a single dispatch
      const nextStories: Story[] = []
      // the counter will be used to trigger a dispatch after a 
      // get req has been made for each id, as well as to
      // exit the loop in the event of certain errors
      let counter = 50

      // creates a sublist of the next 50 ids from the listOfStoryIds
      const nextSublistOfIds = listOfStoryIds.slice(
        totalStoriesRequested,
        totalStoriesRequested + 50
      )

      // prevent superfluous api calls when current listOfIds is exhausted
      if (nextSublistOfIds.length === 0) return dispatch({ type: 'END_OF_LIST' })

      for (let id of nextSublistOfIds) {
        // if server is unresponsive, counter will be set
        // to -1 to prevent unecessary api calls
        if (counter === -1) break

        try {
          const nextStoryData = await axios.get(`${SINGLE_STORY_URL}${id}.json`)

          if (nextStoryData) {
            // format the response
            const editedStoryData: Story = {
              id: nextStoryData.data.id,
              title: nextStoryData.data.title,
              url: nextStoryData.data.url
            }

            // for each successful fetch, push the story to the
            // temporary holding array and decrement counter 
            nextStories.push(editedStoryData)
            counter--
          }

          // success dispatch is sent only after all 50 ids
          // have been looped through and no 5XX errors have occurred
          if (counter === 0) {
            dispatch({
              type: 'FETCH_STORIES_SUCCESS',
              payload: nextStories
            })
          }
        } catch (err) {
          // send error dispatch and break from loop
          // only for 5XX category status codes
          if (err.response && err.response.status > 499) {
            console.log(err)

            dispatch({ type: 'FETCH_STORIES_FAILURE' })

            counter = -1
          } else {
            // for all other errors continue looping though the
            // remaining story ids
            console.log(err)

            counter--
          }
        }
      }
    }
  }, [listOfStoryIds, totalStoriesRequested])

  return { fetchStories, loadingStories, storyData, endOfIdsList, loadingStoriesError }
}
