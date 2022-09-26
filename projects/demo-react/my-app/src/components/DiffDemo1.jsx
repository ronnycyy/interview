// 比对同一类型的元素

import React from 'react';

export default function App() {
  const [name, setName] = React.useState('before');

  const handleClick = () => {
    setName(name === 'before' ? 'after' : 'before');
  }

  return (
    <div className={name} title="stuff">
      <button onClick={handleClick}>change class name</button>
    </div>
  )
}