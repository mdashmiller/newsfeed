import React from 'react'

interface Story {
  id: number,
  title: string | null,
  url?: string
}

interface Props {
  stories: Story[],
  initialLoading: boolean,
  initialLoadError: boolean,
  loadingMore: boolean,
  loadingMoreError: boolean,
  setMoreStoriesRequested: any // TODO: declare funtion as prop in ts
}

export const Headlines: React.FC<Props> = ({
  stories,
  initialLoading,
  initialLoadError,
  loadingMore,
  loadingMoreError,
  setMoreStoriesRequested
}) => {

  const buttonText = loadingMore ? 'Loading...' : 'Load More Stories'

  if (initialLoading) return <div>Loading...</div>

  if (initialLoadError) return <div>Something went wrong :(</div>

  return (
    <div>
      <ul>
        {!!stories && stories.map(story =>
          <a href={story.url} key={story.id} target="_blank" rel="noopener noreferrer">
            <li data-testid="list-item">
              {story.title}
            </li>
          </a>
        )}
      </ul>
      {loadingMoreError ? (
        <div>
          <p style={{ 'margin': '40px 20px 0px 40px', 'color': 'red' }}>
            Something went wrong :(
          </p>
          <button
            onClick={() => setMoreStoriesRequested(true)}
            disabled={loadingMore}
            style={{ 'margin': '10px 20px 40px 40px' }}
          >
            Try Again
          </button>
        </div>
      ) : (
        <button
          onClick={() => setMoreStoriesRequested(true)}
          disabled={loadingMore}
          style={{ 'margin': '20px 20px 40px 40px' }}
        >
          {buttonText}
        </button>
      )}
    </div>
  )
}
