import React from 'react'
import ReactDOM from 'react-dom'
import App from './Components/App'
import './style.scss'
import { Provider } from 'react-redux'
import Store from './Store/Store'
import { store } from './Redux Store'

const appStore = { store: new Store() }
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App {...appStore} />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
// "homepage": "http://ivoron.github.io/flight-app",
