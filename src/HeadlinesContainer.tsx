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

  const fetchMoreStories = () => {
    dispatch({ type: 'FETCH_MORE_INIT' })

    const nextIds: number[] = headlinesData.newStoriesIds.slice(
      headlinesData.numStoriesLastReq,
      headlinesData.numStoriesLastReq + 10
    )
    const nextStories: Story[] = []
    let counter = 10

    nextIds.forEach(async id => {
      try {
        const nextStoryData = await axios(`${SINGLE_STORY_URL}${id}.json`)
        const editedStoryData: Story = {
          id: nextStoryData.data.id,
          title: nextStoryData.data.title,
          url: nextStoryData.data.url
        }

        nextStories.push(editedStoryData)
        counter--

        if (counter === 0) {
          dispatch({
            type: 'FETCH_MORE_SUCCESS',
            payload: nextStories
          })
        }
      } catch (err) {
        // trigger conditional error render in <Healines />
        // only for 5XX category status codes
        if (err.response && err.response.status > 499) {
          dispatch({ type: 'FETCH_MORE_FAILURE' })
        }

        // TODO: handle a network error

        counter--

        console.log(err)
      }
    })
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
