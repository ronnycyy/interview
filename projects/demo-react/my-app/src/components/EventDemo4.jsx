import React from 'react';

function Demo() {
  const handleClick = () => {
    console.log('click');
  }
  const handleChange = () => {
    console.log('change');
  }
  return (
    <div>
      <input type="text" onChange={handleChange} />
      <button onClick={handleClick}>点击</button>
    </div>
  )
}

export default Demo;
