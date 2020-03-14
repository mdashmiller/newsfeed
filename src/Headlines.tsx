import React from 'react'

interface Story {
  id: number,
  title: string | null,
  url?: string
}

interface Props {
  storyData: Story[],
  initialLoading: boolean,
  initialLoadError: boolean,
  fetchMoreStories: any, // TODO: change to function type
  loadingMore: boolean,
  loadingMoreError: boolean,
}

export const Headlines: React.FC<Props> = ({
  storyData: stories,
  initialLoading,
  initialLoadError,
  fetchMoreStories,
  loadingMore,
  loadingMoreError
}) => {
  const buttonText = loadingMore ? 'Loading...' : 'Load More Stories'

  if (initialLoading) return <div data-testid="initial-loading">Loading...</div>

  if (initialLoadError) return <div data-testid="initial-error">Something went wrong :(</div>

  return (
    <div>
      <ul>
        {!!stories && stories.map(story =>
          <li data-testid={`headline-${story.id}`} key={story.id}>
            <a href={story.url} target="_blank" rel="noopener noreferrer">
              {story.title}
            </a>
          </li>
        )}
      </ul>
      {loadingMoreError ? (
        <div data-testid="load-more-error">
          <p style={{ 'margin': '40px 20px 0px 40px', 'color': 'red' }}>
            Something went wrong :(
          </p>
          <button
            data-testid="try-again"
            onClick={() => fetchMoreStories()}
            disabled={loadingMore}
            style={{ 'margin': '10px 20px 40px 40px' }}
          >
            Try Again
          </button>
        </div>
      ) : (
        <button
          data-testid={loadingMore ? 'more-loading' : 'load-more'}
          onClick={() => fetchMoreStories()}
          disabled={loadingMore}
          style={{ 'margin': '20px 20px 40px 40px' }}
        >
          {buttonText}
        </button>
      )}
    </div>
  )
}
