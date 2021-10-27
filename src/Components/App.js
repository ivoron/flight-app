import React from 'react'
import { inject, observer } from 'mobx-react'
import FlightList from './FlightList'
import Sidebar from './Sidebar'

const App = inject('store')(
  observer((props) => {
    const { store } = props
    return (
      <div className="App">
        <Sidebar AppStore={store} />
        <div className="content">
          <FlightList AppStore={store} />
        </div>
      </div>
    )
  })
)
export default App
