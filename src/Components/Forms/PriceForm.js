import React, { useEffect, useState } from 'react'

export default function PriceForm({ setPriceRange }) {
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  useEffect(() => {
    setPriceRange(minPrice, maxPrice)
  }, [setPriceRange, minPrice, maxPrice])

  return (
    <div className="form-container">
      <label>
        <p>Цена</p>
        <form className="sorting-form">
          <label>
            от{' '}
            <input
              placeholder="0"
              type="number"
              name="minPrice"
              onChange={(event) => setMinPrice(event.target.value)}
              value={minPrice}
            ></input>
          </label>
          <label>
            до{' '}
            <input
              placeholder="100000"
              type="number"
              name="maxPrice"
              onChange={(event) => setMaxPrice(event.target.value)}
              value={maxPrice}
            ></input>
          </label>
        </form>
      </label>
    </div>
  )
}
