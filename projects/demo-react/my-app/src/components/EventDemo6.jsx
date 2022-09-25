import React from 'react';

function EventDemo6() {

  const handleClick1 = () => {
    console.log('handleClick1');
  }

  const handleClick2 = () => {
    console.log('handleClick2');
  }

  const handleClick3 = (e) => {
    debugger;
    e.stopPropagation();
    console.log('handleClick3');
  }

  const handleClick4 = () => {
    console.log('handleClick4');
  }

  return (
    <div onClick={handleClick1}>
      <h1>EventDemo6</h1>
      <div onClick={handleClick2}>
        <p onClick={handleClick3}>
          <button onClick={handleClick4}>冒泡</button>
        </p>
      </div>
    </div>
  )
}

export default EventDemo6;