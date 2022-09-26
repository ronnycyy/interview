import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import App from './App';

export default function run() {
  const red = 'color: #e91e63';
  const green = 'color: green';

  console.log('%cReactDOMServer.renderToString:', red);
  console.log(`%c"${ReactDOMServer.renderToString(<App />)}"`, red);

  console.log('%cReactDOMServer.renderToStaticMarkup:', green);
  console.log(`%c"${ReactDOMServer.renderToStaticMarkup(<App />)}"`, green);
}
