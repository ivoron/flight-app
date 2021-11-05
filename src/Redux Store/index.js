import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'

// action types
export const FETCH_FLIGHTS = 'FETCH_FLIGHTS'
export const LOAD_FLIGHTS = 'LOAD_FLIGHTS'
export const SET_LOADING = 'SET_LOADING'
export const ADD_FLIGHTS = 'ADD_FLIGHTS'

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
    case ADD_FLIGHTS:
      return {
        ...state,
        startIndex: state.endIndex,
        endIndex: state.endIndex + state.listLimit,
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
    .catch((error) => console.error(error))
}

export const loadFlights = (state) => {
  let flightsPortion = []
  return (dispatch) => {
    dispatch(setLoadingAC(true))
    for (let i = state.startIndex; i < state.endIndex; i++) {
      flightsPortion.push(state.allFlights[i])
    }
    dispatch(loadFlightsAC(flightsPortion))
    dispatch(setLoadingAC(false))
    console.log(state)
  }

  // this.setShowFiltred(false)
}
export const addFlights = (dispatch) => {
  dispatch(addFlightsAC())
  const state = store.getState()
  dispatch(loadFlights(state))
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

export const store = createStore(reducer, applyMiddleware(thunk))
