import React from 'react'
import FlightInfoItem from './FlightInfoItem'
import FlightItem from './FlightItem'

const FlightCard = ({ flightInfo }) => {
  return (
    <div className="flight-card">
      <FlightInfoItem flightInfo={flightInfo} />
      {flightInfo.legs.map((direction) => (
        <FlightItem
          key={direction.segments[0].arrivalDate}
          flightSegment={direction.segments}
        />
      ))}
      <button className="flight-card-btn">выбрать</button>
    </div>
  )
}
export default FlightCard
