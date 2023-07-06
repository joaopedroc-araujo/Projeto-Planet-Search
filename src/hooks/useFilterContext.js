import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const FilterContext = createContext('');

export function FilterProvider({ children }) {
  const [filterValue, setFilterValue] = useState('');

  return (
    <FilterContext.Provider value={ { filterValue, setFilterValue } }>
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
