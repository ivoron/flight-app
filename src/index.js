import React from 'react'
import ReactDOM from 'react-dom'
import App from './Components/App'
import './style.scss'
import Store from './Store/Store'

const appStore = { store: new Store() }
ReactDOM.render(
  <React.StrictMode>
    <App {...appStore} />
  </React.StrictMode>,
  document.getElementById('root')
)
