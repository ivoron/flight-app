import { observer } from 'mobx-react'
import React from 'react'
import AviaFilterForm from './Forms/AviaFilterForm'
import FilterForm from './Forms/FilterForm'
import PriceForm from './Forms/PriceForm'
import SortingForm from './Forms/SortingForm'

const Sidebar = observer(({ AppStore }) => {
  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <SortingForm sortingFlights={AppStore.sortingFlights} />
        <FilterForm selectTransfers={AppStore.selectTransfers} />
        <PriceForm
          showPriceRange={AppStore.showPriceRange}
          setPriceRange={AppStore.setPriceRange}
        />
        <AviaFilterForm
          carriers={AppStore.carriers}
          selectCompanies={AppStore.selectCompanies}
        />
      </div>
      {AppStore.showFiltred &&
        (AppStore.filtredFlights.length ? (
          <p className="filter-message">
            Найдено: {AppStore.filtredFlights.length} рейсов
          </p>
        ) : (
          <p className="filter-message">
            По заданному фильтру рейсов не найдено
          </p>
        ))}
    </div>
  )
})
export default Sidebar
