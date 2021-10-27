import React from 'react'

export default function FlightItem({ flightSegment }) {
  const showDate = (date) => {
    const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
    const months = [
      'янваяря',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ]
    return `${new Date(date).toLocaleTimeString().slice(0, -3)}
      ${days[new Date(date).getDay()]},
        ${new Date(date).getDate()}
        ${months[new Date(date).getMonth()]}
      `
  }
  const showDepAirport = (place) => {
    return `${place.departureCity?.caption || ''},
    ${place.departureAirport.caption || ''} (${place.departureAirport.uid})`
  }
  const showArrAirport = (place) => {
    return `${place.arrivalCity?.caption || ''},
      ${place?.arrivalAirport?.caption || ''} (${place.arrivalAirport.uid})`
  }
  const showTransfer = () => {
    let answer = ''
    switch (flightSegment.length) {
      case 1:
        answer = 'без пересадок'
        break
      case 2:
        answer = `1 пересадка в аэропорту ${flightSegment[0].arrivalAirport.caption}`
        break
      case 3:
        answer = '2 пересадки'
        break
      default:
        answer = 'более 2х пересадок'
    }
    return answer
  }
  const departureDate = flightSegment[0].departureDate
  const arrivalDate = flightSegment[flightSegment.length - 1].arrivalDate
  const daysDifference =
    new Date(arrivalDate).getDay() - new Date(departureDate).getDay()

  const showDuration = () => {
    let hours =
      new Date(arrivalDate).getHours() -
      new Date(departureDate).getHours() +
      daysDifference * 24
    let minutes =
      new Date(arrivalDate).getMinutes() - new Date(departureDate).getMinutes()
    if (minutes < 0) {
      hours -= 1
      minutes += 60
    }
    let answer = `${hours}  час. ${minutes} мин.`
    return answer
  }
  return (
    <div className="flight-segment">
      <div className="flight-card-info">
        <p>{showDepAirport(flightSegment[0])}</p>
        <p>&rarr;</p>
        <p>{showArrAirport(flightSegment[flightSegment.length - 1])}</p>
      </div>
      <div className="flight-card-info">
        <p>Отпр. {showDate(departureDate)}</p>
        <p>&#128349; {showDuration()}</p>
        <p>Приб. {showDate(arrivalDate)}</p>
      </div>
      <div className="decorLine">
        <p></p>
        <p>{showTransfer()}</p>
        <p></p>
      </div>
      <div className="airline-info">
        Рейс выполняет: {flightSegment[0].airline.caption}
      </div>
    </div>
  )
}
