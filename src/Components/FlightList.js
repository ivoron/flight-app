import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FlightCard from './FlightCard'
import Loader from './Loader'
import NoResult from './NoResult'
import { addFlights, getFlightList } from '../Redux Store'

const FlightList = () => {
  const { error, currentFlights, filtredFlights, isLoading, showFiltred } =
    useSelector((state) => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getFlightList)
  }, [dispatch])

  const loadRef = React.useRef()

  React.useEffect(() => {
    const callback = (entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        dispatch(addFlights)
      }
    }
    const options = {
      rootMargin: '100px',
      threshold: 1.0,
    }
    const observer = new IntersectionObserver(callback, options)
    observer.observe(loadRef.current)
  }, [isLoading, dispatch])
  return (
    <div className="flight-list">
      {!isLoading ? (
        showFiltred ? (
          filtredFlights.map((flight) => (
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
      {error && !isLoading && <h3>{error}</h3>}
      {!filtredFlights.length && showFiltred ? (
        <NoResult />
      ) : (
        <div ref={loadRef}></div>
      )}
    </div>
  )
}
export default FlightList
