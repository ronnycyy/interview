import React from 'react';

function EventDemo8() {

  const handleChange = (e) => {
    debugger;
    console.log(e.target.value);
  }

  return (
    <div>
      <h1>EventDemo8</h1>
      <input id="demo" type="text" onChange={handleChange} />
    </div>
  )
}

export default EventDemo8;