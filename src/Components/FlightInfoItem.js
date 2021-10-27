import React from 'react'

export default function FlightInfoItem({ flightInfo }) {
  const price = flightInfo.price.total
  return (
    <div className="flight-card-price">
      <p>&#9992; {flightInfo.carrier.caption}</p>
      <p>
        {price.amount} {price.currency} <br />
        <span>Стоимость для одного взрослого пассажира</span>
      </p>
    </div>
  )
}
