import React, { useEffect, useReducer } from 'react'
import axios from 'axios'
import { Headlines } from './Headlines'
import { headlinesFetchReducer, headlinesInitialState } from './headlinesFetchReducer'

const SINGLE_STORY_URL = 'https://hacker-news.firebaseio.com/v0/item/'
const NEW_STORIES_URL = 'https://hacker-news.firebaseio.com/v0/newstories.json'

interface Story {
  id: number,
  title: string | null,
  url?: string
}

export const HeadlinesContainer: React.FC = () => {
  const [headlinesData, dispatch] = useReducer(headlinesFetchReducer, headlinesInitialState)

  useEffect(() => {
    // sets the most recent headline on mount
    const fetchTopStory = async () => {
      dispatch({ type: 'MOUNT_FETCH_INIT' })

      try {
        const listOfStoryIds = await axios.get(NEW_STORIES_URL)
        const topStoryData = await axios.get(`${SINGLE_STORY_URL}${listOfStoryIds.data[0]}.json`)

        const payload = {
          storyIds: listOfStoryIds.data,
          storyData: [
            {
              id: topStoryData.data.id,
              title: topStoryData.data.title,
              url: topStoryData.data.url
            }
          ]
        }

        dispatch({ type: 'MOUNT_FETCH_SUCCESS', payload })
      } catch {
        dispatch({ type: 'MOUNT_FETCH_FAILURE' })
      }
    }

    fetchTopStory()
  }, [])

  // gets the next ten story ids from the list of the most
  // recent 500 (newStoryIds) in state and loops through
  // them using each to make an api call to the
  // single-story endpoint for that id
  const fetchMoreStories = async () => {
    dispatch({ type: 'FETCH_MORE_INIT' })

    const nextIds: number[] = headlinesData.newStoriesIds.slice(
      headlinesData.totalStoriesRequested,
      headlinesData.totalStoriesRequested + 10
    )
    const nextStories: Story[] = []
    let counter = 10

    for (let id of nextIds) {
      // if server is unresponsive, counter is set
      // to -1 to prevent unecessary api calls
      if (counter === -1) break

      try {
        const nextStoryData = await axios.get(`${SINGLE_STORY_URL}${id}.json`)

        if (nextStoryData) {
          const editedStoryData: Story = {
            id: nextStoryData.data.id,
            title: nextStoryData.data.title,
            url: nextStoryData.data.url
          }

          nextStories.push(editedStoryData)
          counter--
        }

        if (counter === 0) {
          dispatch({
            type: 'FETCH_MORE_SUCCESS',
            payload: nextStories
          })
        }
      } catch (err) {
        // trigger conditional error render in <Healines /> and
        // break from loop only for 5XX category status codes
        if (err.response && err.response.status > 499) {
          console.log(err)

          dispatch({ type: 'FETCH_MORE_FAILURE' })

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

  return (
    <>
      <h1 style={{ 'marginLeft': '22px' }}>News</h1>
      <Headlines
        storyData={headlinesData.storyData}
        initialLoading={headlinesData.initialLoading}
        initialLoadError={headlinesData.initialLoadError}
        fetchMoreStories={fetchMoreStories}
        loadingMore={headlinesData.loadingMore}
        loadingMoreError={headlinesData.loadingMoreError}
      />
    </>
  )
}
