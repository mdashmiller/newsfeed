import React, { useState, useEffect } from 'react'
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

const initialStoriesValue: Story[] = []
const initialIdsValue: number[] = []

export const HeadlinesContainer: React.FC = () => {
  // TODO: move to reducer
  const [newStoriesIds, setNewStoriesIds] = useState(initialIdsValue)
  const [storyData, setStoryData] = useState(initialStoriesValue)
  const [initialLoading, setInitialLoading] = useState(false)
  const [initialLoadError, setInitialLoadError] = useState(false)
  const [moreStoriesRequsted, setMoreStoriesRequested] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadingMoreError, setLoadingMoreError] = useState(false)
  const [numStoriesLastReq, setNumStoriesLastReq] = useState(0)

  useEffect(() => {
    const fetchTopStory = async () => {
      setInitialLoading(true)
      setInitialLoadError(false)

      try {
        const listOfStoryIds = await axios(newStoriesURL)

        setNewStoriesIds(listOfStoryIds.data)
        setNumStoriesLastReq(1)
        
        const topStoryData = await axios(`${singleStoryURL}${listOfStoryIds.data[0]}.json`)

        setStoryData([{
          id: topStoryData.data.id,
          title: topStoryData.data.title,
          url: topStoryData.data.url
        }])
        setInitialLoading(false)
      } catch {
        setInitialLoadError(true)
        setInitialLoading(false)
      }
    }
    
    fetchTopStory()
  }, [])

  if (moreStoriesRequsted) {
    setLoadingMore(true)
    setLoadingMoreError(false)

    const fetchMoreStories = () => {
      const nextIds: number[] = newStoriesIds.slice(numStoriesLastReq, numStoriesLastReq + 10)

      nextIds.forEach(async id => {
        try {
          const nextStoryData = await axios(`${singleStoryURL}${id}.json`)
          const editedStoryData: Story = {
            id: nextStoryData.data.id,
            title: nextStoryData.data.title,
            url: nextStoryData.data.url
          }

          setStoryData((storyData: Story[]) => [...storyData, editedStoryData])
        } catch (err) {
          // trigger conditional error render in <Healines />
          // only for 5XX category status codes
          if (err.response && err.response.status > 499) {
            setLoadingMoreError(true)
          }

          console.log(err)
        }
      })

      setLoadingMore(false) // TODO: get timing correct for this state change
      setNumStoriesLastReq(numStoriesLastReq + 10)
    }
    
    fetchMoreStories()
    setMoreStoriesRequested(false)
  }
  
  return (
    <>
      <h1 style={{ 'marginLeft': '22px' }}>News</h1>
      <Headlines
        stories={storyData}
        initialLoading={initialLoading}
        initialLoadError={initialLoadError}
        setMoreStoriesRequested={setMoreStoriesRequested}
        loadingMore={loadingMore}
        loadingMoreError={loadingMoreError}
      />
    </>
  );
}
