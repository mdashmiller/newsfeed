import React, { useRef, useEffect } from 'react'

interface Story {
  id: number,
  title: string | null,
  url?: string
}

interface Props {
  storyData: Story[],
  initialLoading: boolean,
  initialLoadError: boolean,
  fetchMoreStories(): any,
  loadingMore: boolean,
  loadingMoreError: boolean
}

const handleIntersect: IntersectionObserverCallback = entries => {
  const target = entries[0]

  // log message to console when last headline in the
  // list appears on screen
  if (target.isIntersecting) {
    console.log('Last item visible!!!')
  }
}

export const Headlines: React.FC<Props> = ({
  storyData,
  initialLoading,
  initialLoadError,
  fetchMoreStories,
  loadingMore,
  loadingMoreError
}) => {
  const endOfList = useRef<HTMLLIElement>(null)
  const buttonText = loadingMore ? 'Loading...' : 'Load More Stories'

  // each time more headlines are rendered change the endOfList
  // ref to refer to the last headline on screen
  useEffect(() => {
    // create an observer to watch for when the final
    // headline is scrolled into view
    const observer = new IntersectionObserver(handleIntersect)

    // when the list of headlines has rendered, the final
    // headline will be stored in the endOfList ref and
    // observed by the Intersection Observer API
    if (endOfList && endOfList.current) {
      observer.observe(endOfList.current)
    }

    // unobserve on willUnmount
    return () => observer.disconnect()
  }, [storyData.length])

  if (initialLoading) return <div data-testid="initial-loading">Loading...</div>

  if (initialLoadError) return <div data-testid="initial-error">Something went wrong :(</div>

  return (
    <div>
      <ul>
        {!!storyData && storyData.map((story, index) => {
          // return an li with endOfList ref only if it
          // is the last item in the storyData array
          if (index === storyData.length - 1) {
            return (
              <li data-testid={`headline-${story.id}`} key={story.id} ref={endOfList}>
                <a href={story.url} target="_blank" rel="noopener noreferrer">
                  {story.title}
                </a>
              </li>
            )
          } else {
            return (
              <li data-testid={`headline-${story.id}`} key={story.id}>
                <a href={story.url} target="_blank" rel="noopener noreferrer">
                  {story.title}
                </a>
              </li>
            )
          }
        })}
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
