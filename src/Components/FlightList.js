import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FlightCard from './FlightCard'
import Loader from './Loader'
import NoResult from './NoResult'
import { addFlights, getFlightList } from '../Redux Store'

const FlightList = ({ AppStore }) => {
  const load = useSelector((state) => state.isLoading)
  const array = useSelector((state) => state.currentFlights)
  const dispatch = useDispatch()
  const { currentFlights } = AppStore
  useEffect(() => {
    dispatch(getFlightList)
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
        dispatch(addFlights)
        // AppStore.addFlights()
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
          array.map((flight) => (
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
}
export default observer(FlightList)
