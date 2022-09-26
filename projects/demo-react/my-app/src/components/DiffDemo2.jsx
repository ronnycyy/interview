// 在头部插入结点

import React from 'react';


function List({ list }) {
  return (
    <ul>
      {
        list.map(l => <li key={l}>{l}</li>)
      }
    </ul>
  )
}

export default function App() {
  const [list, setList] = React.useState(['Duke', 'Villanova']);
  const [title] = React.useState('good name');

  const handleClick = () => {
    list.unshift('Connecticut');
    setList([...list]);
  }

  return (
    <div title={title}>
      <p>1</p>
      <p>2</p>
      <p>3</p>
      <p>4</p>
      <button onClick={handleClick}>增加</button>
      <List list={list} />
    </div>
  )
}