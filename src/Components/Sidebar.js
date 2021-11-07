import { observer } from 'mobx-react'
import React from 'react'
import { useSelector } from 'react-redux'
import AviaFilterForm from './Forms/AviaFilterForm'
import FilterForm from './Forms/FilterForm'
import PriceForm from './Forms/PriceForm'
import SortingForm from './Forms/SortingForm'

const Sidebar = observer(({ AppStore }) => {
  const { showFiltred, filtredFlights } = useSelector((state) => state)
  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <SortingForm />
        <FilterForm />
        <PriceForm
          showPriceRange={AppStore.showPriceRange}
          setPriceRange={AppStore.setPriceRange}
        />
        <AviaFilterForm
          carriers={AppStore.carriers}
          selectCompanies={AppStore.selectCompanies}
        />
      </div>
      {showFiltred &&
        (filtredFlights.length ? (
          <p className="filter-message">
            Найдено: {filtredFlights.length} рейсов
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
