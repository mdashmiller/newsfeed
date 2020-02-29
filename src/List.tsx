import React from 'react'

interface Item {
  id: number,
  title: string
}

interface Props {
  list: Item[]
}

export const List: React.FC<Props> = ({ list }) => {
  return (
    <div>
      <ul>
        {!!list && list.map(item =>
          <li data-testid="list-item" key={item.id}>
            {item.title}
          </li>
        )}
      </ul>
    </div>
  )
}
