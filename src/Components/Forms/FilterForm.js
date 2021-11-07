import React from 'react'
import { selectTransfers } from '../../Redux Store'
import { useDispatch } from 'react-redux'

export default function FilterForm() {
  const dispatch = useDispatch()
  const toggleOptions = (event) => {
    dispatch(selectTransfers(event.target.value, event.target.checked))
  }
  return (
    <div className="form-container">
      <label>
        <p>Фильтровать</p>
        <form className="sorting-form">
          <label>
            <input
              name="filter-form"
              type="checkbox"
              value="no-transfer"
              onChange={(event) => toggleOptions(event)}
            />{' '}
            - без пересадок
          </label>
          <label>
            <input
              name="filter-form"
              type="checkbox"
              value="one-transfer"
              onChange={(event) => toggleOptions(event)}
            />{' '}
            - одна пересадка
          </label>
        </form>
      </label>
    </div>
  )
}
