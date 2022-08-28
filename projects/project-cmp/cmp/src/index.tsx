import * as React from "react";
import * as ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import App from './container/App';
import store from "./store";

const el = document.getElementById("root");
// @ts-ignore
ReactDOM.createRoot(el).render(
  <Provider store={store}>
    <App />
  </Provider>
);
