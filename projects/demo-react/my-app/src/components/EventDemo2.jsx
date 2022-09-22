import React from 'react';

function Demo() {
  const handleClick = () => {
    console.log('冒泡!')
  }

  const handleClickCapture = () => {
    console.log('捕获~')
  }

  return (
    <div>
      <h1>模拟捕获和冒泡</h1>
      <button onClick={handleClick} onClickCapture={handleClickCapture} onKey>点击</button>
    </div>
  )
}

export default Demo;