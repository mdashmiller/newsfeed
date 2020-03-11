import React from 'react'
import { HeadlinesContainer } from './HeadlinesContainer'
import { render, waitForElement } from '@testing-library/react'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('HeadlinesContainer data fetching and rendering', () => {

  it('renders loading message then data on mount', async () => {
    // mock data to resolve from Hackernews API
    const listOfIds = {
      data: [1, 2, 3]
    }
    const topStoryData = {
      data: {
        id: 1,
        title: 'Top Test Story',
        url: 'test_url'
      }
    }

    // mock the 2 API calls in useEffect
    mockedAxios.get.mockResolvedValueOnce(listOfIds)
    mockedAxios.get.mockResolvedValueOnce(topStoryData)

    const { queryByTestId, getByTestId } = render(<HeadlinesContainer />)

    expect(getByTestId('loading-message')).toBeInTheDocument()

    const headline = await waitForElement(() => getByTestId('headline'))

    expect(headline).toBeInTheDocument()
    expect(queryByTestId('loading-message')).not.toBeInTheDocument()
  })

  it('renders error when fetch fails on mount', async () => {
    mockedAxios.get.mockImplementationOnce(() =>
      Promise.reject(new Error())
    )

    const { getByTestId, queryByTestId } = render(<HeadlinesContainer />)

    expect(getByTestId('loading-message')).toBeInTheDocument()

    const errorMessage = await waitForElement(() => getByTestId('init-error'))

    expect(errorMessage).toBeInTheDocument()
    expect(queryByTestId('loading-message')).not.toBeInTheDocument()
  })

})
