import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const FilterContext = createContext('');

export function FilterProvider({ children }) {
  const [filterValue, setFilterValue] = useState('');
  const [column, setColumn] = useState('population');
  const [comparison, setComparison] = useState('maior que');
  const [value, setValue] = useState(0);

  const applyFilter = (data) => {
    const parsedValue = parseFloat(value);
    let newData = [];

    if (!Number.isNaN(parsedValue)) {
      if (comparison === 'maior que') {
        newData = data.filter((planet) => parseFloat(planet[column]) > parsedValue);
      } else if (comparison === 'menor que') {
        newData = data.filter((planet) => parseFloat(planet[column]) < parsedValue);
      } else if (comparison === 'igual a') {
        newData = data.filter((planet) => parseFloat(planet[column]) === parsedValue);
      } else {
        newData = data;
      }
    } else {
      newData = data;
    }

    return newData;
  };

  const filterContextValues = {
    filterValue,
    setFilterValue,
    column,
    setColumn,
    comparison,
    setComparison,
    value,
    setValue,
    applyFilter,
  };

  return (
    <FilterContext.Provider value={ filterContextValues }>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  return useContext(FilterContext);
}

FilterProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
