import { applyMiddleware, createStore, compose } from 'redux'
import thunk from 'redux-thunk'

// action types
export const FETCH_FLIGHTS = 'FETCH_FLIGHTS'
export const FETCH_ERROR = 'FETCH_ERROR'
export const LOAD_FLIGHTS = 'LOAD_FLIGHTS'
export const SET_LOADING = 'SET_LOADING'
export const ADD_FLIGHTS = 'ADD_FLIGHTS'
export const ASCENDING_PRICE_FILTER = 'ASCENDING_PRICE_FILTER'
export const DESCENDING_PRICE_FILTER = 'DESCENDING_PRICE_FILTER'
export const DURATION_FILTER = 'DURATION_FILTER'
export const SHOW_FILTRED_FLIGHTS = 'SHOW_FILTRED_FLIGHTS'
export const ADD_TRANSFER_OPTION = 'ADD_TRANSFER_OPTION'
export const REMOVE_TRANSFER_OPTION = 'REMOVE_TRANSFER_OPTION'
export const FILTER_FLIGHTS = 'FILTER_FLIGHTS'

const initialState = {
  allFlights: [], //массив всех перелетов
  currentFlights: [], // отображаемый массив перелетов
  filtredFlights: [], //отфильтрованные перелеты
  filterPrices: {
    minPrice: '',
    maxPrice: '',
  }, // диапазон цен для фильтрации
  transferOptions: [], //список пересодок для фильтрации
  carriers: [], // список доступных авиакомпаний
  filtredCarriers: [], // список выбранных авиакомпаний
  isLoading: true, //индикатор загрузки
  error: null, //ошибка при запросе к API
  showFiltred: false, //индикатор отображения отфильтрованныъ перелетов
  startIndex: 0, //стартовый индекс добавления в текущий массив из общего
  listLimit: 10, // лимит на единоразовое добавление в текущий массив
  endIndex: 10, // конечный индекс  добавления в текущий массив из общего}
}
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FLIGHTS:
      return { ...state, allFlights: [...action.payload] }
    case LOAD_FLIGHTS:
      return {
        ...state,
        currentFlights: [...state.currentFlights, ...action.payload],
      }
    case SET_LOADING:
      return { ...state, isLoading: action.payload }
    case FETCH_ERROR:
      return { ...state, error: action.payload }
    case ADD_FLIGHTS:
      return {
        ...state,
        startIndex: state.endIndex,
        endIndex: state.endIndex + state.listLimit,
      }
    case ASCENDING_PRICE_FILTER:
      return {
        ...state,
        filtredFlights: state.currentFlights.sort(function (a, b) {
          return +a.flight.price.total.amount - +b.flight.price.total.amount
        }),
      }
    case DESCENDING_PRICE_FILTER:
      return {
        ...state,
        filtredFlights: state.currentFlights.sort(function (a, b) {
          return +b.flight.price.total.amount - +a.flight.price.total.amount
        }),
      }
    case DURATION_FILTER:
      return {
        ...state,
        filtredFlights: state.currentFlights.sort(function (a, b) {
          return (
            a.flight.legs[0].duration +
            a.flight.legs[1].duration -
            (b.flight.legs[0].duration + b.flight.legs[1].duration)
          )
        }),
      }
    case ADD_TRANSFER_OPTION:
      return {
        ...state,
        transferOptions: [...state.transferOptions, action.payload],
      }
    case REMOVE_TRANSFER_OPTION:
      return {
        ...state,
        transferOptions: state.transferOptions.filter(
          (option) => option !== action.payload
        ),
      }
    case SHOW_FILTRED_FLIGHTS:
      return {
        ...state,
        showFiltred: action.payload,
      }
    case FILTER_FLIGHTS:
      return {
        ...state,
        filtredFlights: action.payload,
      }
    default:
      return state
  }
}
// actions
export const getFlightList = (dispatch) => {
  fetch('./flights.json')
    .then((response) => response.json())
    .then((data) => data.result)
    .then((result) => {
      dispatch(fetchFlightsAC(result.flights))
    })
    .then(() => {
      dispatch(loadFlights(store.getState()))
    })
    .catch((error) => {
      dispatch(fetchErrorAC(`Can't load flights from server`))
      console.error(error)
      dispatch(setLoadingAC(false))
    })
}

export const loadFlights = (state) => {
  let flightsPortion = []
  return (dispatch) => {
    for (let i = state.startIndex; i < state.endIndex; i++) {
      flightsPortion.push(state.allFlights[i])
    }
    dispatch(loadFlightsAC(flightsPortion))
    dispatch(setLoadingAC(false))
  }
}
export const addFlights = (dispatch) => {
  dispatch(addFlightsAC())
  const state = store.getState()
  dispatch(setShowFiltredAC(false))
  dispatch(loadFlights(state))
}
export const sortingFlights = (value) => {
  return (dispatch) => {
    dispatch(setShowFiltredAC(true))
    switch (value) {
      case 'ascending-price':
        dispatch(ascendingFilterAC())
        break
      case 'descending-price':
        dispatch(descendingFilterAC())
        break
      case 'duration':
        dispatch(durationFilterAC())
        break
      default:
        return false
    }
  }
}
export const selectTransfers = (name, check) => {
  return (dispatch) => {
    if (check) {
      dispatch(addTransferOptionAC(name))
    } else {
      dispatch(removeTransferOptionAC(name))
    }
    dispatch(filterByValue('transfer'))
  }
}
export const filterByValue = (type) => {
  const state = store.getState()

  const temporaryFlights = [...state.filtredFlights]
  // this.showPriceRange()

  return (dispatch) => {
    if (!state.showFiltred) {
      dispatch(filterFlightsAC([...state.currentFlights]))
      dispatch(setShowFiltredAC(true))
    }
    if (type === 'transfer') {
      if (!state.transferOptions.length) {
        dispatch(setShowFiltredAC(false))
        dispatch(filterFlightsAC([...temporaryFlights]))
      } else {
        dispatch(setShowFiltredAC(true))
        for (let option of state.transferOptions) {
          if (option === 'no-transfer') {
            // this.filtredFlights = [
            //   ...this.filtredFlights.filter(
            //     (flight) =>
            //       flight.flight.legs[0].segments.length === 1 &&
            //       flight.flight.legs[1].segments.length === 1
            //   ),
            // ]
            dispatch(
              filterFlightsAC([
                temporaryFlights.filter(
                  (flight) =>
                    flight.flight.legs[0].segments.length === 1 &&
                    flight.flight.legs[1].segments.length === 1
                ),
              ])
            )
          } else if (option === 'one-transfer') {
            dispatch(
              filterFlightsAC(
                temporaryFlights.filter(
                  (flight) =>
                    flight.flight.legs[0].segments.length +
                      flight.flight.legs[1].segments.length ===
                    3
                )
              )
            )

            // this.filtredFlights = [
            //   ...this.filtredFlights.filter(
            //     (flight) =>
            //       flight.flight.legs[0].segments.length +
            //         flight.flight.legs[1].segments.length ===
            //       3
            //   ),
            // ]
          }
        }
      }
      // this.setCarriers()
    }
  }

  if (type === 'career') {
    const temporaryFlights = [...this.filtredFlights]
    if (!this.filtredCarriers.length) {
      this.filtredFlights = [...temporaryFlights]
    } else {
      this.filtredFlights = []
      for (let career of this.filtredCarriers) {
        this.filtredFlights = [
          ...this.filtredFlights,
          ...this.currentFlights.filter(
            (flight) => flight.flight.carrier.caption === career
          ),
        ]
      }
      this.setShowFiltred(true)
    }
  }
}

// action creators
export const fetchFlightsAC = (payload) => {
  return {
    type: FETCH_FLIGHTS,
    payload,
  }
}
export const loadFlightsAC = (payload) => {
  return {
    type: LOAD_FLIGHTS,
    payload,
  }
}
export const fetchErrorAC = (payload) => {
  return {
    type: FETCH_ERROR,
    payload,
  }
}
export const addFlightsAC = () => {
  return {
    type: ADD_FLIGHTS,
  }
}
export const setLoadingAC = (payload) => {
  return {
    type: SET_LOADING,
    payload,
  }
}
export const ascendingFilterAC = () => {
  return {
    type: ASCENDING_PRICE_FILTER,
  }
}
export const descendingFilterAC = () => {
  return {
    type: DESCENDING_PRICE_FILTER,
  }
}
export const durationFilterAC = () => {
  return {
    type: DURATION_FILTER,
  }
}
export const setShowFiltredAC = (payload) => {
  return {
    type: SHOW_FILTRED_FLIGHTS,
    payload,
  }
}
export const filterFlightsAC = (payload) => {
  return {
    type: FILTER_FLIGHTS,
    payload,
  }
}
export const addTransferOptionAC = (payload) => {
  return {
    type: ADD_TRANSFER_OPTION,
    payload,
  }
}
export const removeTransferOptionAC = (payload) => {
  return {
    type: REMOVE_TRANSFER_OPTION,
    payload,
  }
}

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(
  reducer,
  composeEnhancer(applyMiddleware(thunk))
)
