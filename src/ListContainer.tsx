import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { List } from './List'

const singleStoryURL = 'https://hacker-news.firebaseio.com/v0/item/'
const newStoriesURL = 'https://hacker-news.firebaseio.com/v0/newstories.json'

interface Story {
  id: number,
  title: string, // TODO: add conditional render for title: undefined
  url?: string
}

const initialStoriesValue: Story[] = []
const initialIdsValue: number[] = []

export const ListContainer: React.FC = () => {
  const [newStoriesIds, setNewStoriesIds] = useState(initialIdsValue)
  const [storyData, setStoryData] = useState(initialStoriesValue)
  const [loadMore, setLoadMore] = useState(false)
  const [numOfStories, setNumOfStories] = useState(0)
  const [loading, setLoading] = useState(false)
  // TODO: error state

  useEffect(() => {
    const fetchTopStory = async () => { // TODO: add error handling
      setLoading(true)

      const listOfStoryIds = await axios(newStoriesURL)

      setNewStoriesIds(listOfStoryIds.data)

      const topStoryData = await axios(`${singleStoryURL}${listOfStoryIds.data[0]}.json`)

      setNumOfStories(1)
      setStoryData([{
        id: topStoryData.data.id,
        title: topStoryData.data.title,
        url: topStoryData.data.url
      }])
      setLoading(false)
    }
    
    fetchTopStory()
  }, [])

  if (loadMore) {
    const fetchNextTenStories = async () => { // TODO: add error handling
      const nextTenIds: number[] = newStoriesIds.slice(numOfStories, numOfStories + 10)

      nextTenIds.forEach(async (id: number) => {
        const nextStoryData = await axios(`${singleStoryURL}${id}.json`)
        const editedStoryData: Story = {
          id: nextStoryData.data.id,
          title: nextStoryData.data.title,
          url: nextStoryData.data.url
        }

        setLoadMore(false)
        setNumOfStories(numOfStories + 10)
        setStoryData((data: Story[]): Story[] => [...data, editedStoryData])
      })
    }

    fetchNextTenStories()
  }

  return (
    <>
      <h1 style={{ 'marginLeft': '22px' }}>News</h1>
      <List
        list={storyData}
        setLoadMore={setLoadMore}
        loading={loading}
        loadMore={loadMore}
      />
    </>
  );
}
