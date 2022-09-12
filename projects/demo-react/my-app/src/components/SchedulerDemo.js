import React from 'react';

function App() {
  const len = 5000;

  return (
    <ul>
      {
        Array(len).fill(0).map((_, i) => <li key={i}>{i}</li>)
      }
    </ul>
  )
}

export default App;