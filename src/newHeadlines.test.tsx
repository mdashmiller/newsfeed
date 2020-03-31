import React from 'react'
import { Headlines } from './Headlines'
import { render, waitFor } from '@testing-library/react'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Headlines data fetching and rendering', () => {

  // mock the IntersectionObserver API
  Object.defineProperty(window, 'IntersectionObserver', {
    value: jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn()
    }))
  })

  it('renders loading then error when fetch fails on mount', async () => {
    // mock an error in fetchListOfIds
    mockedAxios.get.mockImplementationOnce(() =>
      Promise.reject()
    )

    const { getByTestId, findByTestId, queryByTestId } = render(<Headlines />)

    // onMount component should call fetchListOfIds
    // and render the loading-ids element
    expect(getByTestId('loading-ids')).toBeInTheDocument()

    // once fetchListOfIds rejects with an error
    // the ids-error element should render
    await waitFor(() => findByTestId('ids-error'))
      .then(() => expect(queryByTestId('loading-ids')).not.toBeInTheDocument())
      .catch(err => console.log(err))
  })

  it('renders endOfList and calls fetchStories on successful fetchListOfIds', async () => {
    // mock list of story ids to resolve
    // from HackerNews API
    const makeMockIdList = (howMany: number) => {
      const listOfIds: number[] = []
      for (let i = 0; i < howMany; i++) {
        listOfIds.push(i)
      }

      return listOfIds
    }

    // mock get req in useEffect onMount
    mockedAxios.get.mockResolvedValueOnce(makeMockIdList(50))

    const { getByTestId, findByTestId, queryByTestId } = render(<Headlines />)

    // onMount component should call fetchListOfIds
    // and render the loading-ids element
    expect(getByTestId('loading-ids')).toBeInTheDocument()

    // once fetchListOfIds resolves with listOfIds the
    // end-of-list element should render which should
    // invoke IntersectionObserver fetchStories callback
    await waitFor(() => findByTestId('end-of-list'))
      .then(() => expect(queryByTestId('loading-ids')).not.toBeInTheDocument())
      // TODO: mock fetchStories callback and assert on times called
      .catch(err => console.log(err))
  })
})
