import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import FlightCard from './FlightCard'
import Loader from './Loader'
import NoResult from './NoResult'

const FlightList = observer(({ AppStore }) => {
  const { currentFlights } = AppStore
  useEffect(() => {
    AppStore.getFlightList()
  }, [AppStore])
  const loadRef = React.useRef()
  const options = {
    rootMargin: '100px',
    threshold: 1.0,
  }

  React.useEffect(() => {
    const callback = (entries, observer) => {
      if (entries[0].isIntersecting && !AppStore.isLoading) {
        AppStore.addFlights()
      }
    }
    const observer = new IntersectionObserver(callback, options)
    observer.observe(loadRef.current)
  }, [AppStore])
  return (
    <div className="flight-list">
      {!AppStore.isLoading ? (
        AppStore.showFiltred ? (
          AppStore.filtredFlights.map((flight) => (
            <FlightCard key={flight.flightToken} flightInfo={flight.flight} />
          ))
        ) : (
          currentFlights.map((flight) => (
            <FlightCard key={flight.flightToken} flightInfo={flight.flight} />
          ))
        )
      ) : (
        <Loader />
      )}
      {!AppStore.filtredFlights.length && AppStore.showFiltred ? (
        <NoResult />
      ) : (
        <div ref={loadRef}></div>
      )}
    </div>
  )
})
export default FlightList
