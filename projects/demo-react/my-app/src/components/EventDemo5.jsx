import React from 'react';

function Index() {
  const handleClick1 = () => console.log(1)
  const handleClick2 = () => console.log(2)
  const handleClick3 = () => console.log(3)
  const handleClick4 = () => { console.log(4) }
  return <div onClick={handleClick3} onClickCapture={handleClick4}  >
    <button onClick={handleClick1} onClickCapture={handleClick2}  >点击</button>
  </div>
}

export default Index;
