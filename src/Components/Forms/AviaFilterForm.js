import React from 'react'
import { observer } from 'mobx-react'

const AviaFilterForm = observer(({ carriers, selectCompanies }) => {
  return (
    <div className="form-container">
      <label>
        <p>Авиакомпании</p>
        <form className="sorting-form">
          {carriers.map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                name={item}
                onChange={(event) =>
                  selectCompanies(event.target.name, event.target.checked)
                }
              />
              {item}
            </label>
          ))}
        </form>
      </label>
    </div>
  )
})
export default AviaFilterForm
