import React, { useReducer, useEffect } from 'react'
import axios from 'axios'
import { Headlines } from './Headlines'

// TODO: move to environment variables
const singleStoryURL = 'https://hacker-news.firebaseio.com/v0/item/'
const newStoriesURL = 'https://hacker-news.firebaseio.com/v0/newstories.json'

interface Story {
  id: number,
  title: string | null,
  url?: string
}

interface State {
  newStoriesIds: number[],
  storyData: Story[],
  initialLoading: boolean,
  initialLoadError: boolean,
  loadingMore: boolean,
  loadingMoreError: boolean,
  numStoriesLastReq: number
}

interface MountFetchInit {
  readonly type: 'MOUNT_FETCH_INIT'
}

interface MountFetchPayload {
  storyIds: number[],
  storyData: Story[]
}

interface MountFetchSuccess {
  readonly type: 'MOUNT_FETCH_SUCCESS',
  readonly payload: MountFetchPayload
}

interface MountFetchFailure {
  readonly type: 'MOUNT_FETCH_FAILURE'
}

interface FetchMoreInit {
  readonly type: 'FETCH_MORE_INIT'
}

interface FetchMoreSuccess {
  readonly type: 'FETCH_MORE_SUCCESS',
  readonly payload: Story[]
}

interface FetchMoreFailure {
  readonly type: 'FETCH_MORE_FAILURE'
}

type Actions =  MountFetchInit | MountFetchSuccess | MountFetchFailure | 
                FetchMoreInit | FetchMoreSuccess | FetchMoreFailure

const initialState: State = {
  newStoriesIds: [],
  storyData: [],
  initialLoading: false,
  initialLoadError: false,
  loadingMore: false,
  loadingMoreError: false,
  numStoriesLastReq: 0
}

const headlinesFetchReducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'MOUNT_FETCH_INIT':
      return {
        ...state,
        initialLoading: true,
        initialLoadError: false
      }
    case 'MOUNT_FETCH_SUCCESS':
      return {
        ...state,
        newStoriesIds: action.payload.storyIds,
        storyData: action.payload.storyData,
        initialLoading: false,
        numStoriesLastReq: 1
      }
    case 'MOUNT_FETCH_FAILURE':
      return {
        ...state,
        initialLoadError: true,
        initialLoading: false
      }
    case 'FETCH_MORE_INIT':
      return {
        ...state,
        loadingMore: true,
        loadingMoreError: false
      }
    case 'FETCH_MORE_SUCCESS':
      return {
        ...state,
        storyData: [...state.storyData, ...action.payload],
        loadingMore: false,
        numStoriesLastReq: state.numStoriesLastReq + 10
      }
    case 'FETCH_MORE_FAILURE':
      return {
        ...state,
        loadingMoreError: true,
        loadingMore: false
      }
    default:
      throw new Error('reached default case')
  }
}

export const HeadlinesContainer: React.FC = () => {
  const [state, dispatch] = useReducer(headlinesFetchReducer, initialState)

  useEffect(() => {
    const fetchTopStory = async () => {
      dispatch({ type: 'MOUNT_FETCH_INIT'})

      try {
        const listOfStoryIds = await axios(newStoriesURL)
        const topStoryData = await axios(`${singleStoryURL}${listOfStoryIds.data[0]}.json`)

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

        dispatch({ type: 'MOUNT_FETCH_SUCCESS', payload})
      } catch {
        dispatch({ type: 'MOUNT_FETCH_FAILURE' })
      }
    }
    
    fetchTopStory()
  }, [])

  const fetchMoreStories = () => {
    dispatch({ type: 'FETCH_MORE_INIT'})

    const nextIds: number[] = state.newStoriesIds.slice(
      state.numStoriesLastReq,
      state.numStoriesLastReq + 10
    )
    const nextStories: Story[] = []
    let counter = 10

    nextIds.forEach(async id => {
      try {
        const nextStoryData = await axios(`${singleStoryURL}${id}.json`)
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
        stories={state.storyData}
        initialLoading={state.initialLoading}
        initialLoadError={state.initialLoadError}
        fetchMoreStories={fetchMoreStories}
        loadingMore={state.loadingMore}
        loadingMoreError={state.loadingMoreError}
      />
    </>
  )
}
