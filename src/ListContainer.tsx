import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { List } from './List'

const singleStoryURL = 'https://hacker-news.firebaseio.com/v0/item/'
const newStoriesURL = 'https://hacker-news.firebaseio.com/v0/newstories.json'

export const ListContainer: React.FC = () => {
  const [id, setId] = useState(0)
  const [title, setTitle] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const newStories = await axios(newStoriesURL)
      const topStoryId = newStories.data[0]
      const topStoryData = await axios(`${singleStoryURL}${topStoryId}.json`)

      setId(topStoryData.data.id)
      setTitle(topStoryData.data.title)
    }

    fetchData()
  }, [])

  return (
    <List list={[{ id, title }]} />
  )
}
