interface Story {
  id: number,
  title: string | null,
  url?: string
}

interface State {
  newStoriesIds: number[],
  storyData: Story[],
  initialLoading: boolean,
  initialLoadError: boolean,
  loadingMore: boolean,
  loadingMoreError: boolean,
  totalStoriesRequested: number
}

interface MountFetchInit {
  readonly type: 'MOUNT_FETCH_INIT'
}

interface MountFetchPayload {
  storyIds: number[],
  storyData: Story[]
}

interface MountFetchSuccess {
  readonly type: 'MOUNT_FETCH_SUCCESS',
  readonly payload: MountFetchPayload
}

interface MountFetchFailure {
  readonly type: 'MOUNT_FETCH_FAILURE'
}

interface FetchMoreInit {
  readonly type: 'FETCH_MORE_INIT'
}

interface FetchMoreSuccess {
  readonly type: 'FETCH_MORE_SUCCESS',
  readonly payload: Story[]
}

interface FetchMoreFailure {
  readonly type: 'FETCH_MORE_FAILURE'
}

type Actions = MountFetchInit | MountFetchSuccess | MountFetchFailure |
  FetchMoreInit | FetchMoreSuccess | FetchMoreFailure

export const headlinesInitialState: State = {
  newStoriesIds: [],
  storyData: [],
  initialLoading: false,
  initialLoadError: false,
  loadingMore: false,
  loadingMoreError: false,
  totalStoriesRequested: 0
}

export const headlinesFetchReducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'MOUNT_FETCH_INIT':
      return {
        ...state,
        initialLoading: true,
        initialLoadError: false
      }
    case 'MOUNT_FETCH_SUCCESS':
      return {
        ...state,
        newStoriesIds: action.payload.storyIds,
        storyData: action.payload.storyData,
        initialLoading: false,
        totalStoriesRequested: 1
      }
    case 'MOUNT_FETCH_FAILURE':
      return {
        ...state,
        initialLoadError: true,
        initialLoading: false
      }
    case 'FETCH_MORE_INIT':
      return {
        ...state,
        loadingMore: true,
        loadingMoreError: false
      }
    case 'FETCH_MORE_SUCCESS':
      return {
        ...state,
        storyData: [...state.storyData, ...action.payload],
        loadingMore: false,
        totalStoriesRequested: state.totalStoriesRequested + 10
      }
    case 'FETCH_MORE_FAILURE':
      return {
        ...state,
        loadingMoreError: true,
        loadingMore: false
      }
    default:
      throw new Error('reached default case')
  }
}
