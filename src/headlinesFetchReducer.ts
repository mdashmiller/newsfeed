interface Story {
  id: number,
  title: string | null,
  url?: string
}

interface State {
  listOfStoryIds: number[],
  storyData: Story[],
  loadingIds: boolean,
  loadingStories: boolean,
  loadingIdsError: boolean,
  loadingStoriesError: boolean,
  totalStoriesRequested: number
}

interface fetchIdsInit {
  readonly type: 'FETCH_IDS_INIT'
}

interface fetchIdsSuccess {
  readonly type: 'FETCH_IDS_SUCCESS'
  readonly payload: number[]
}

interface fetchIdsFailure {
  readonly type: 'FETCH_IDS_FAILURE'
}

interface fetchStoriesInit {
  readonly type: 'FETCH_STORIES_INIT'
}

interface fetchStoriesSuccess {
  readonly type: 'FETCH_STORIES_SUCCESS',
  readonly payload: Story[]
}

interface fetchStoriesFailure {
  readonly type: 'FETCH_STORIES_FAILURE'
}

type Actions = fetchIdsInit | fetchIdsSuccess | fetchIdsFailure |
  fetchStoriesInit | fetchStoriesSuccess | fetchStoriesFailure

export const headlinesInitialState: State = {
  listOfStoryIds: [],
  storyData: [],
  loadingIds: false,
  loadingStories: false,
  loadingIdsError: false,
  loadingStoriesError: false,
  totalStoriesRequested: 0
}

export const headlinesFetchReducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'FETCH_IDS_INIT':
      return {
        ...state,
        loadingIds: true,
        loadingIdsError: false
      }
    case 'FETCH_IDS_SUCCESS':
      return {
        ...state,
        listOfStoryIds: action.payload,
        loadingIds: false
      }
    case 'FETCH_IDS_FAILURE':
      return {
        ...state,
        loadingIdsError: true,
        loadingIds: false
      }
    case 'FETCH_STORIES_INIT':
      return {
        ...state,
        loadingStories: true,
        loadingStoriesError: false
      }
    case 'FETCH_STORIES_SUCCESS':
      return {
        ...state,
        storyData: [...state.storyData, ...action.payload],
        loadingStories: false,
        totalStoriesRequested: state.totalStoriesRequested + 50
      }
    case 'FETCH_STORIES_FAILURE':
      return {
        ...state,
        loadingStoriesError: true,
        loadingStories: false
      }
    default:
      throw new Error('reached default case')
  }
}
