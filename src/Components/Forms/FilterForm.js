import React from 'react'

export default function FilterForm({ selectTransfers }) {
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
              onChange={(event) =>
                selectTransfers(event.target.value, event.target.checked)
              }
            />{' '}
            - без пересадок
          </label>
          <label>
            <input
              name="filter-form"
              type="checkbox"
              value="one-transfer"
              onChange={(event) =>
                selectTransfers(event.target.value, event.target.checked)
              }
            />{' '}
            - одна пересадка
          </label>
        </form>
      </label>
    </div>
  )
}
