import React from 'react'

interface Item {
  id: number,
  title: string,
  url?: string
}

interface Props {
  list: Item[],
  setLoadMore: any, // TODO: declare funtion as prop in ts
  loading: boolean,
  loadMore: boolean
}

export const List: React.FC<Props> = ({ list, setLoadMore, loading, loadMore }) => {
  if (loading) return <div>Loading...</div>

  return (
    <div>
      <ul>
        {!!list && list.map(item =>
          <a href={item.url} key={item.id} target="_blank" rel="noopener noreferrer">
            <li data-testid="list-item">
              {item.title}
            </li>
          </a>
        )}
      </ul>
      {loadMore ? (
        <div>Getting more headlines...</div>
      ) : (
        <button
          onClick={() => setLoadMore(true)}
          style={{ 'margin': '10px 20px 40px 40px' }}
        >
          Load More
        </button>
      )}
    </div>
  )
}
