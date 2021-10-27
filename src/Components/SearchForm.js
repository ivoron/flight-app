import React from 'react'

export default function SearchForm(props) {
  const { AppStore } = props
  const [startPoint, setStartPoint] = React.useState('')
  const [destinationPoint, setDestinationPoint] = React.useState('')

  React.useEffect(() => {
    AppStore.getFlightList()
  }, [AppStore])

  const searchFlights = (e) => {
    e.preventDefault()
    if (startPoint.trim() && destinationPoint.trim()) {
      AppStore.setStartPoint(startPoint)
      AppStore.setDestinationPoint(destinationPoint)
      setStartPoint('')
      setDestinationPoint('')
      // AppStore.searchFlights()
    } else {
      return null
    }
  }

  return (
    <form onSubmit={searchFlights}>
      <input
        type="text"
        name="departure"
        placeholder="откуда"
        onInput={(event) => setStartPoint(event.target.value)}
        value={startPoint}
      />
      <input
        type="text"
        name="arrival"
        placeholder="куда"
        onInput={(event) => setDestinationPoint(event.target.value)}
        value={destinationPoint}
      />
      <button>поиск</button>
    </form>
  )
}
