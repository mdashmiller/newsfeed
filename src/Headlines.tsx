import React, { useEffect, useReducer, useCallback, useRef } from 'react'
import axios from 'axios'
import { headlinesFetchReducer, headlinesInitialState } from './headlinesFetchReducer'

const SINGLE_STORY_URL = 'https://hacker-news.firebaseio.com/v0/item/'
const NEW_STORIES_URL = 'https://hacker-news.firebaseio.com/v0/newstories.json'

interface Story {
  id: number,
  title: string | null,
  url?: string
}

export const Headlines: React.FC = () => {
  const [{
    listOfStoryIds,
    storyData,
    loadingStories,
    loadingStoriesError,
    loadingIds,
    loadingIdsError,
    totalStoriesRequested
  }, dispatch] = useReducer(headlinesFetchReducer, headlinesInitialState)
  // refObject will store loader element at end of headlines list which will be
  // used with Intersection Observer to trigger get reqs for infinite scroll
  const loader = useRef<HTMLDivElement>(null)

  // fetch the ids of the most recent 500
  // stories from hackernews api on mount
  useEffect(() => {
    const fetchListOfIds = async () => {
      dispatch({ type: 'FETCH_IDS_INIT' })

      try {
        const listOfIds = await axios.get(NEW_STORIES_URL)
        
        dispatch({
          type: 'FETCH_IDS_SUCCESS',
          payload: listOfIds.data
        })
      } catch {
        dispatch({ type: 'FETCH_IDS_FAILURE' })
      }
    }

    fetchListOfIds()
  }, [])

  // use listOfStoryIds in state to fetch data for first 50 individual stories on
  // mount and 50 more each time the user scrolls to the end of the list of headlines
  // by tracking intersection of loader in the viewport
  const fetchStories: IntersectionObserverCallback = useCallback(async entries => {
    // set loading indicator as target
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
      // starting from the index of the last story requested + 1
      const nextSublistOfIds = listOfStoryIds.slice(
        totalStoriesRequested,
        totalStoriesRequested + 50
      )

      // TODO: handle reaching end of listOfStoryIds

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
            // for all other errors, continue looping though the
            // remaining story ids
            console.log(err)

            counter--
          }
        }
      }
    }
  }, [listOfStoryIds, totalStoriesRequested])

  useEffect(() => {
    // create an observer to watch for when the loading
    // indicator appears in the viewport
    const observer = new IntersectionObserver(fetchStories)

    if (loader && loader.current) {
      observer.observe(loader.current)
    }

    // unobserve on willUnmount
    return () => observer.disconnect()
  }, [fetchStories])

  if (loadingIds) return <div>Loading...</div>

  if (loadingIdsError) return <div>Something went wrong :(</div>

  return (
    <section>
      <h2>News</h2>
      <ul>
        {!!storyData && storyData.map(story =>
          <li data-testid={`headline-${story.id}`} key={story.id}>
            <a href={story.url} target="_blank" rel="noopener noreferrer">
              {story.title}
            </a>
          </li>
        )}
      </ul>
      {loadingStoriesError ? (
        <>
          <p>Something went wrong... :(</p>
          <button>Try Again?</button>
          {/* TODO: add onClick fetchStories */}
        </>
      ) : (
        loadingStories ? (
          <div>Loading...</div>
        ) : (
          <div ref={loader}>END OF LIST</div>
          // TODO: replace with loader icon
        )
      )}
    </section>
  )
}
