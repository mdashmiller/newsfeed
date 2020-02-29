import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { List } from './List'

const singleStoryURL = 'https://hacker-news.firebaseio.com/v0/item/'
const newStoriesURL = 'https://hacker-news.firebaseio.com/v0/newstories.json'

interface Story {
  id: number,
  title: string
}

export const ListContainer: React.FC = () => {
  const initialValue: Story[] = []
  const [data, setData] = useState(initialValue)

  useEffect(() => {
    const fetchData = async () => {
      const newStoriesIdList = await axios(newStoriesURL)
      const topTenStoriesIdList = newStoriesIdList.data.slice(0, 10)
      
      topTenStoriesIdList.forEach(async (id: number) => {
        const storyDataObj = await axios(`${singleStoryURL}${id}.json`)
        const idAndTitleObj = { id: storyDataObj.data.id, title: storyDataObj.data.title }

        setData((data: Story[]): Story[] => [...data, idAndTitleObj])
      })

    }

    fetchData()
  }, [])

  return (
    <List list={data} />
  );
}
