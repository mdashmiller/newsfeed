import React, { useEffect, useReducer, useRef } from 'react'
import axios from 'axios'
import { headlinesFetchReducer, headlinesInitialState } from './headlinesFetchReducer'
import { useFetchStories } from './useFetchStories'

const NEW_STORIES_URL = 'https://hacker-news.firebaseio.com/v0/newstories.json'

export const Headlines: React.FC = () => {
  const [
    {
      listOfStoryIds,
      loadingIds,
      loadingIdsError
    }, 
    dispatch
  ] = useReducer(headlinesFetchReducer, headlinesInitialState)

  const { 
    fetchStories,
    storyData,
    loadingStories, 
    loadingStoriesError,
    endOfIdsList
  } = useFetchStories(listOfStoryIds)

  // refObject will store getMoreHeadlines div at end of headlines list which will be
  // used with Intersection Observer to trigger get reqs for infinite scroll
  const getMoreHeadlines = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    // create an observer to watch for when the
    // getMoreHeadlines div appears in the viewport
    const observer = new IntersectionObserver(fetchStories)

    if (getMoreHeadlines && getMoreHeadlines.current) {
      observer.observe(getMoreHeadlines.current)
    }

    // unobserve on willUnmount
    return () => observer.disconnect()
  }, [fetchStories])

  if (loadingIds) return <div data-testid="loading-ids">Loading...</div>

  if (loadingIdsError) return <div data-testid="ids-error">Something went wrong :(</div>
  
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
      {endOfIdsList ? (
        null
      ) : (
        loadingStoriesError ? (
          <>
            <p>Something went wrong... :(</p>
            {/* FETCH_STORIES_RETRY simply sets loadingStoriesError back to false so that the getMoreHeadlines
            div will render, thus triggering the IntersectionObserver fetchStories callback again */}
            <button onClick={() => dispatch({ type: 'FETCH_STORIES_RETRY' })}>Try Again?</button>
          </>
        ) : (
          loadingStories ? (
            // TODO: replace with loader icon
            <div>Loading...</div>
          ) : (
            <div data-testid="end-of-list" id="end-of-list" ref={getMoreHeadlines}>
              END OF BATCH!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            </div>
          )
        )
      )}
    </section>
  )
}
