import React from 'react'
import { HeadlinesContainer } from './HeadlinesContainer'
import { render, waitForElement, fireEvent } from '@testing-library/react'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('HeadlinesContainer data fetching and rendering', () => {

  it('renders loading message and data correctly', async () => {
    // this first set of tests covers the fetching and
    // rendering of the component on mount

    // mock data to resolve from Hackernews API
    const listOfIds = {
      data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    }
    const topStoryData = {
      data: {
        id: 0,
        title: 'Test Title',
        url: 'test_url_0'
      }
    }

    // mock the 2 API calls in useEffect
    mockedAxios.get.mockResolvedValueOnce(listOfIds)
    mockedAxios.get.mockResolvedValueOnce(topStoryData)

    const { queryByTestId, getByTestId, getAllByText } = render(<HeadlinesContainer />)

    // component should display an initial
    // loading message on mount
    expect(getByTestId('init-loading')).toBeInTheDocument()
    expect(queryByTestId('headline-0')).not.toBeInTheDocument()

    // wait for data from axios to render as 'headline-0'
    await waitForElement(() => getByTestId('headline-0'))
      .then(() => {
        expect(mockedAxios.get).toHaveBeenCalledTimes(2)
        expect(queryByTestId('init-loading')).not.toBeInTheDocument()
      })
      .catch(err => console.log(err))

    // this next set of tests covers fetching and rendering
    // when user clicks button to load more headlines

    interface FakeStory {
      data: {
        id: number,
        title: string,
        url: string
      }
    }

    // creates an object that stands-in for a
    // single story returned from Hackernews API
    const fakeStoryMaker = (int: number): FakeStory => {
      return {
        data: {
          id: int,
          title: `Test Title`,
          url: `test_url_${int}`
        }
      }
    }

    // mocking the api calls to fetch the
    // next 10 stories
    mockedAxios.get.mockReset()

    for (let i = 1; i < 11; i++) {
      mockedAxios.get.mockResolvedValueOnce(fakeStoryMaker(i))
    }

    // simulate user clicking 'Load More Stories' button
    fireEvent.click(getByTestId('load-more'))

    // 'Load More Stories' button should be disabled and
    // display loading text when clicked
    expect(getByTestId('more-loading')).toBeInTheDocument()
    expect(getByTestId('more-loading')).toHaveAttribute('disabled')

    // wait until the last headline renders and
    // test that there are now 11 total
    await waitForElement(() => getByTestId(`headline-10`))
      .then(() => getAllByText('Test Title'))
      .then(headlines => {
        expect(headlines.length).toBe(11)
        expect(mockedAxios.get).toHaveBeenCalledTimes(10)
        expect(queryByTestId('more-loading')).not.toBeInTheDocument()
        expect(getByTestId('load-more')).toBeInTheDocument()
        expect(getByTestId('load-more')).not.toHaveAttribute('disabled')
      })
      .catch(err => console.log(err))

      // TODO: add test for loadMoreError
  })

  it('renders error when fetch fails on mount', async () => {
    mockedAxios.get.mockImplementationOnce(() =>
      Promise.reject(new Error())
    )

    const { getByTestId, queryByTestId } = render(<HeadlinesContainer />)

    expect(getByTestId('init-loading')).toBeInTheDocument()
    expect(queryByTestId('headline-0')).not.toBeInTheDocument()

    // once initial fetch has resolved with an error the 
    // component should render 'init-error' and 
    // 'init-loading' should disappear 
    await waitForElement(() => getByTestId('init-error'))
      .then(() => {
        expect(queryByTestId('init-loading')).not.toBeInTheDocument()
        expect(queryByTestId('headline-0')).not.toBeInTheDocument()
      })
      .catch(err => console.log(err))
  })

})
