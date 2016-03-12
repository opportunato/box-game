import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';

import reducer from './reducers';

import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import App from './components/App';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);

ReactDOM.render(
  <Provider store = { store }>
    <App />
  </Provider>,
  document.getElementById('app')
);
