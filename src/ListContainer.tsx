import React, { useState, useEffect } from 'react'
import axios from 'axios'

export const ListContainer: React.FC = () => {
  const [data, setData] = useState(null)
  // const [error, setError] = useState(null)

  // useEffect(() => {
  //   axios.get('https://hacker-news.firebaseio.com/v0/item/8863.json')
  //     .then(res => {
  //       setData(res.data)
  //       setError(null)
  //       console.log(res)
  //     })
  //     .catch(err => {
  //       setError(err)
  //       console.log(err)
  //     })
  // }, [])

  // if (error) return <div>Error :(</div>

  if (!data) return <div>Loading...</div>

  return (
    <div>

    </div>
  )
}
