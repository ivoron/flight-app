import React from 'react'
import { useDispatch } from 'react-redux'
import { sortingFlights } from '../../Redux Store'

export default function SortingForm() {
  const dispatch = useDispatch()

  const sortFlights = (value) => {
    dispatch(sortingFlights(value))
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
              value="duration"
              onInput={(event) => sortFlights(event.target.value)}
            />{' '}
            - по времени в пути
          </label>
        </form>
      </label>
    </div>
  )
}
