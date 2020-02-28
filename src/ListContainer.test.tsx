import React from 'react'
import { render, wait } from '@testing-library/react'
import { ListContainer } from './ListContainer'
// import axios from 'axios'
// import MockAdapter from 'axios-mock-adapter'

// creates mocked version of axios with delay
// const mock = new MockAdapter(axios, { delayResponse: Math.random() * 5000 })

// afterAll(() => mock.restore())

describe('ListContainer component', () => {

  it('fetches list of items and renders them', async () => {
    // renders ListContainer component
    const { getByText } = render(<ListContainer />)

    // expects loading text to display when list has not been loaded yet
    expect(getByText('Loading...')).toBeInTheDOM

    // expects error text to display when error occurs
    // mock.onGet().networkErrorOnce()
    // await wait(() => expect(getByText('Loading...')).not.toBeInTheDOM)
    // expect(getByText('Error :(')).toBeInTheDOM
  })

})
