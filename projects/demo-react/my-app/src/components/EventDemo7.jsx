import React from 'react';

function EventDemo7() {

  const handleClick1 = (e) => {
    console.log('handleClick1');
  }
  const handleClick2 = () => {
    console.log('handleClick2');
  }
  const handleClick3 = (e) => {
    console.log('handleClick3');
  }
  const handleClick4 = () => {
    console.log('handleClick4');
  }
  const handleChange = (e) => {
    console.log(e.currentTarget);
    console.log(e.target);
  }

  React.useEffect(() => {
    const handleClick = () => {
      console.log('document click');
    }
    document.addEventListener('click', handleClick, false);
    return () => {
      document.removeEventListener('click', handleClick, false);
    }
  }, [])

  return (
    <div onClick={handleClick1}>
      <h1>EventDemo7</h1>
      <label htmlFor="demo">demo:</label>
      <input id="demo" type="text" onChange={handleChange} />
      <div onClick={handleClick2}>
        <p onClick={handleClick3}>
          <button onClick={handleClick4}>冒泡</button>
        </p>
      </div>
    </div>
  )
}

export default EventDemo7;