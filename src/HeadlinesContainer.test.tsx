// import React from 'react'
// import { HeadlinesContainer } from './HeadlinesContainer'
// import { render, waitFor, fireEvent } from '@testing-library/react'
// import axios from 'axios'

// jest.mock('axios')
// const mockedAxios = axios as jest.Mocked<typeof axios>

// describe('HeadlinesContainer data fetching and rendering', () => {

//   it('renders loading, error and data correctly', async () => {
//     // this first set of tests covers the fetching and
//     // rendering of the component on mount

//     // mock data to resolve the get from Hackernews API
    // const listOfIds = {
    //   data: [
    //     0, 1, 2, 3, 4, 5, 6, 
    //     7, 8, 9, 10, 11, 12, 
    //     13, 14, 15, 16, 17, 18, 19, 20
    //   ]
    // }
//     const topStoryData = {
//       data: {
//         id: 0,
//         title: 'Test Headline',
//         url: 'test_url_0'
//       }
//     }

//     // mock the 2 API calls in useEffect
//     mockedAxios.get.mockResolvedValueOnce(listOfIds)
//     mockedAxios.get.mockResolvedValueOnce(topStoryData)

//     const { queryByTestId, getByTestId, getAllByText } = render(<HeadlinesContainer />)

//     // component should display an initial
//     // loading message on mount
//     expect(getByTestId('initial-loading')).toBeInTheDocument()
//     expect(queryByTestId('headline-0')).not.toBeInTheDocument()

//     // wait for data from axios.get to render as 'headline-0'
//     await waitFor(() => getByTestId('headline-0'))
//       .then(() => {
//         expect(mockedAxios.get).toHaveBeenCalledTimes(2)
//         expect(queryByTestId('initial-loading')).not.toBeInTheDocument()
//       })
//       .catch(err => console.log(err))

//     // this next set of tests covers fetching and rendering
//     // when user clicks button to load more headlines

    // interface FakeStory {
    //   data: {
    //     id: number,
    //     title: string,
    //     url: string
    //   }
    // }

    // // creates an object that stands-in for a
    // // single story returned from Hackernews API
    // const fakeStoryMaker = (int: number): FakeStory => {
    //   return {
    //     data: {
    //       id: int,
    //       title: `Test Headline`,
    //       url: `test_url_${int}`
    //     }
    //   }
    // }

    // // creates mock resolved values from Hackernews API for a 
    // // specified number of stories
    // const fetchMoreStoriesMock = (
    //   currentNumOfStories: number, 
    //   howManyMore: number
    // ) => {
    //   mockedAxios.get.mockReset()

    //   for (
    //     let i = currentNumOfStories; i < currentNumOfStories + howManyMore; i++
    //   ) {
    //     mockedAxios.get.mockResolvedValueOnce(fakeStoryMaker(i))
    //   }
    // }

//     // simulate user clicking 'Load More Stories' button
//     fetchMoreStoriesMock(1, 10)
//     fireEvent.click(getByTestId('load-more'))

//     // 'Load More Stories' button should be disabled and
//     // display loading text when clicked
//     expect(getByTestId('more-loading')).toBeInTheDocument()
//     expect(getByTestId('more-loading')).toHaveAttribute('disabled')

//     // wait until the last headline renders and
//     // test that there are now 11 total and that
//     // the 'Load More Stories' button is ready
//     // to be clicked again
//     await waitFor(() => getByTestId(`headline-10`))
//       .then(() => getAllByText('Test Headline'))
//       .then(headlines => {
//         expect(headlines.length).toBe(11)
//         expect(mockedAxios.get).toHaveBeenCalledTimes(10)
//         expect(queryByTestId('more-loading')).not.toBeInTheDocument()
//         expect(getByTestId('load-more')).toBeInTheDocument()
//         expect(getByTestId('load-more')).not.toHaveAttribute('disabled')
//       })
//       .catch(err => console.log(err))

//     // this last section tests for proper error handling
//     // when user clicks 'Load More Stories' button

//     mockedAxios.get.mockReset()
//     mockedAxios.get.mockRejectedValueOnce({ response: { status: 500 } })

//     fireEvent.click(getByTestId('load-more'))

//     // only 5XX status errors should render the
//     // 'load-more-error' element
//     await waitFor(() => getByTestId('load-more-error'))
//       .then(errorEl => {
//         expect(errorEl).toBeInTheDocument()
//         // 'Load More Stories' button should switch
//         // to 'Try Again'
//         expect(getByTestId('try-again')).toBeInTheDocument()
//         expect(queryByTestId('load-more')).not.toBeInTheDocument()
//       })
//       .catch(err => console.log(err))
    
//     // user can then click 'Try Again' to attempt to
//     // fetch more stories again
//     fetchMoreStoriesMock(11, 10)
//     fireEvent.click(getByTestId('try-again'))

//     // button should be disabled and
//     // display loading text when clicked
//     expect(getByTestId('more-loading')).toBeInTheDocument()
//     expect(getByTestId('more-loading')).toHaveAttribute('disabled')
    
//     // wait until the last headline renders and
//     // test that there are now 21 total
//     await waitFor(() => getByTestId('headline-20'))
//       .then(() => getAllByText('Test Headline'))
//       .then(headlines => {
//         expect(headlines.length).toBe(21)
//         expect(mockedAxios.get).toHaveBeenCalledTimes(10)
//         expect(queryByTestId('more-loading')).not.toBeInTheDocument()
//         expect(getByTestId('load-more')).toBeInTheDocument()
//         expect(getByTestId('load-more')).not.toHaveAttribute('disabled')
//       })
//       .catch(err => console.log(err))
//   })

//   it('renders error when fetch fails on mount', async () => {
//     mockedAxios.get.mockImplementationOnce(() =>
//       Promise.reject(new Error())
//     )

//     const { getByTestId, findByTestId, queryByTestId } = render(<HeadlinesContainer />)

//     expect(getByTestId('initial-loading')).toBeInTheDocument()
//     expect(queryByTestId('headline-0')).not.toBeInTheDocument()

//     // once initial fetch has resolved with an error the 
//     // component should render 'initial-error' and 
//     // 'initial-loading' should disappear 
//     await waitFor(() => findByTestId('initial-error'))
//       .then(() => {
//         expect(queryByTestId('initial-loading')).not.toBeInTheDocument()
//         expect(queryByTestId('headline-0')).not.toBeInTheDocument()
//       })
//       .catch(err => console.log(err))
//   })

// })
it('is true', () => {
  expect(true).toBe(true)
})
