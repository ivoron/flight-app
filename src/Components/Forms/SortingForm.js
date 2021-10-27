import React from 'react'

export default function SortingForm({ sortingFlights }) {
  const sortFlights = (value) => {
    sortingFlights(value)
  }
  return (
    <div className="form-container">
      <label>
        <p>Сортировать</p>
        <form className="sorting-form">
          <label>
            <input
              name="sorting-form"
              type="radio"
              value="ascending-price"
              onInput={(event) => sortFlights(event.target.value)}
            />{' '}
            - сначала дешевые
          </label>
          <label>
            <input
              name="sorting-form"
              type="radio"
              value="descending-price"
              onInput={(event) => sortFlights(event.target.value)}
            />{' '}
            - сначала дорогие
          </label>
          <label>
            <input
              name="sorting-form"
              type="radio"
              value="travel-time"
              onInput={(event) => sortFlights(event.target.value)}
            />{' '}
            - по времени в пути
          </label>
        </form>
      </label>
    </div>
  )
}
