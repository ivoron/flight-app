import { makeAutoObservable } from 'mobx'

class Store {
  allFlights = [] //массив всех перелетов
  currentFlights = [] // отображаемый массив перелетов
  filtredFlights = [] //отфильтрованные перелеты
  bestPrices = {} // не применятся
  filterPrices = {
    minPrice: '',
    maxPrice: '',
  } // диапазон цен для фильтрации
  transferOptions = [] //список пересодок для фильтрации
  carriers = [] // список доступных авиакомпаний
  filtredCarriers = [] // список выбранных авиакомпаний
  isLoading = true //индикатор загрузки
  showFiltred = false //индикатор отображения отфильтрованныъ перелетов
  startIndex = 0 //стартовый индекс добавления в текущий массив из общего
  listLimit = 10 // лимит на единоразовое добавление в текущий массив
  endIndex = 10 // конечный индекс  добавления в текущий массив из общего
  constructor() {
    makeAutoObservable(this)
  }
  //первоначальная загрузка списка перелетов
  getFlightList = async () => {
    fetch('./flights.json')
      .then((response) => response.json())
      .then((data) => data.result)
      .then((result) => {
        this.allFlights.push(...result.flights)
        this.bestPrices = JSON.parse(JSON.stringify(result.bestPrices))
      })
      .then(() => {
        this.loadFlights()
      })
      .catch((error) => console.error(error))
  }
  //загрузка первой порции в текущий массив перелетов
  loadFlights = () => {
    for (let i = this.startIndex; i < this.endIndex; i++) {
      this.currentFlights.push(this.allFlights[i])
    }
    this.setShowFiltred(false)
    this.setLoading(false)
  }
  //подгрузка данных из общего массива в текущий
  addFlights = () => {
    this.setLoading(true)
    this.startIndex += this.listLimit
    this.endIndex += this.listLimit
    this.loadFlights()
    this.setLoading(false)
  }
  //переключение индикатора загрузки
  setLoading = (value) => {
    this.isLoading = value
  }
  //функция сортировки текущего массива -SortingForm.js
  sortingFlights = (value) => {
    if (!this.showFiltred) {
      this.filtredFlights = [...this.currentFlights]
      this.setShowFiltred(true)
    }
    switch (value) {
      case 'ascending-price':
        this.filtredFlights.sort(function (a, b) {
          if (+a.flight.price.total.amount > +b.flight.price.total.amount) {
            return 1
          }
          if (+a.flight.price.total.amount < +b.flight.price.total.amount) {
            return -1
          }
          return 0
        })
        break
      case 'descending-price':
        this.filtredFlights.sort(function (a, b) {
          if (+a.flight.price.total.amount < +b.flight.price.total.amount) {
            return 1
          }
          if (+a.flight.price.total.amount > +b.flight.price.total.amount) {
            return -1
          }
          return 0
        })
        break
      case 'travel-time':
        this.filtredFlights.sort(function (a, b) {
          if (
            a.flight.legs[0].duration + a.flight.legs[1].duration >
            b.flight.legs[0].duration + b.flight.legs[1].duration
          ) {
            return 1
          }
          if (
            a.flight.legs[0].duration + a.flight.legs[1].duration <
            b.flight.legs[0].duration + b.flight.legs[1].duration
          ) {
            return -1
          }
          return 0
        })
        break
      default:
    }
    this.setCarriers()
  }
  //индикатор отображения отфильтрованного массива
  setShowFiltred = (value) => {
    this.showFiltred = value
  }
  //функция фильтрации по по пересадкам и авиакмпаниям (FilterForm.js/AviaFilterForm.js)
  filterByValue = (type) => {
    const temporaryFlights = [...this.filtredFlights]
    this.showPriceRange()
    if (type === 'transfer') {
      if (!this.transferOptions.length) {
        this.setShowFiltred(false)
        this.filtredFlights = [...temporaryFlights]
      } else {
        this.setShowFiltred(true)
        for (let option of this.transferOptions) {
          if (option === 'no-transfer') {
            this.filtredFlights = [
              ...this.filtredFlights.filter(
                (flight) =>
                  flight.flight.legs[0].segments.length === 1 &&
                  flight.flight.legs[1].segments.length === 1
              ),
            ]
          } else if (option === 'one-transfer') {
            this.filtredFlights = [
              ...this.filtredFlights.filter(
                (flight) =>
                  flight.flight.legs[0].segments.length +
                    flight.flight.legs[1].segments.length ===
                  3
              ),
            ]
          }
        }
      }
      this.setCarriers()
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
  //фильтрация текущего массива по мин и макс цене(PriceForm.js)
  setPriceRange = (minPrice, maxPrice) => {
    this.filterPrices = {
      minPrice,
      maxPrice,
    }
    this.showPriceRange()
  }
  showPriceRange = () => {
    this.setShowFiltred(true)
    if (!this.filterPrices.maxPrice) {
      this.filtredFlights = this.currentFlights.filter(
        (flight) =>
          flight.flight.price.total.amount > +this.filterPrices.minPrice
      )
    } else {
      this.filtredFlights = this.currentFlights.filter(
        (flight) =>
          flight.flight.price.total.amount > +this.filterPrices.minPrice &&
          flight.flight.price.total.amount < +this.filterPrices.maxPrice
      )
    }
    if (!this.filterPrices.minPrice && !this.filterPrices.maxPrice) {
      this.setShowFiltred(false)
    }
    this.setCarriers()
  }
  //добавление выбранных опций пересадок в список для фильтрации (FilterForm.js)
  selectTransfers = (name, check) => {
    if (check) {
      this.transferOptions = [...this.transferOptions, name]
    } else {
      this.transferOptions = this.transferOptions.filter(
        (option) => option !== name
      )
    }
    this.filterByValue('transfer')
  }
  //добавление выбранных авиакомпани в список для фильтрации (AviaFilterForm.js)
  selectCompanies = (name, check) => {
    if (check) {
      this.filtredCarriers = [...this.filtredCarriers, name]
    } else {
      this.filtredCarriers = this.filtredCarriers.filter(
        (company) => company !== name
      )
    }
    this.filterByValue('career')
  }
  // получение списка доступных авиакомпаний
  setCarriers = () => {
    this.carriers.length = 0
    this.filtredFlights.map((flight) =>
      this.carriers.push(flight.flight.carrier.caption)
    )
    this.carriers = Array.from(new Set(this.carriers))
  }
}
export default Store
