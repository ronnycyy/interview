import React from 'react';

export default function App() {

  const handleClick = () => {
    console.log('click');
  }

  return (
    <div>
      <h1>SSRDemo1</h1>
      <button onClick={handleClick}>click</button>
    </div>
  )
}