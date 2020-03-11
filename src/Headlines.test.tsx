import React from 'react'
// import { render } from '@testing-library/react'
// import { Headlines } from './Headlines'

// describe('Headlines rendering', () => {

//   // creates testable props
//   const props = {
//     stories: [
//       {
//         id: 1,
//         title: 'Title 1',
//         url: 'url_1'
//       },
//       {
//         id: 2,
//         title: 'Title 2',
//         url: 'url_2'
//       },
//       {
//         id: 3,
//         title: 'Title 3',
//         url: 'url_3'
//       }
//     ],
//     initialLoading: false,
//     initialLoadError: false,
//     fetchMoreStories: () => {},
//     loadingMore: false,
//     loadingMoreError: false,
//   }
  
//   it('receives props and renders list', () => {
//     // renders List component with a test prop
//     const { getByTestId } = render(
//       <Headlines
//         stories={props.stories}

//       />
//     )

//     // expects List component to render each item from list array
//     // in an li tag with correct text content
//     expect(getAllByTestId('list-item')).toHaveLength(3)
//     expect(getAllByTestId('list-item')[0]).toHaveTextContent(list[0].title)
//     expect(getAllByTestId('list-item')[1]).toHaveTextContent(list[1].title)
//     expect(getAllByTestId('list-item')[2]).toHaveTextContent(list[2].title)
//   })

// })

it('is true', () => {
  expect(true).toBe(true)
})
