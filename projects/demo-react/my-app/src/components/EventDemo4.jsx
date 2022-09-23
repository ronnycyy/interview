import React from 'react';

function Demo() {
  const handleClick1 = () => {
    console.log('click1');
  }
  const handleClick2 = (e) => {
    e.stopPropagation();
    console.log('click2');
  }
  const handleClick3 = () => {
    console.log('click3');
  }
  // const handleChange = () => {
  //   console.log('change');
  // }
  return (
    <div onClick={handleClick3} style={{ height: 120, backgroundColor: 'orange' }}>
      <p onClick={handleClick2} style={{ height: 70, backgroundColor: 'lightblue' }}>
        {/* <input type="text" onChange={handleChange} /> */}
        <button onClick={handleClick1} style={{ display: 'block' }}>点击</button>
        父
      </p>
      祖父
    </div>
  )
}

export default Demo;
