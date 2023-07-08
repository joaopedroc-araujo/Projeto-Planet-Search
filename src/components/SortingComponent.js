import { useState } from 'react';
import PropTypes from 'prop-types';
import { originalOptions } from '../helpers/originalOptions';

function SortingComponent({ data, setData }) {
  const [sortColumn, setSortColumn] = useState('population');
  const [sortOrder, setSortOrder] = useState('ASC');

  const negative = -1;
  const sortData = (newData) => {
    const knownData = newData.filter((planet) => planet[sortColumn] !== 'unknown');
    const unknownData = newData.filter((planet) => planet[sortColumn] === 'unknown');

    // console.log(unknownData);
    // console.log(knownData);
    knownData.sort((a, b) => {
      let valueA = a[sortColumn];
      let valueB = b[sortColumn];

      valueA = Number(valueA) || valueA;
      valueB = Number(valueB) || valueB;

      if (valueA < valueB) {
        return sortOrder === 'ASC' ? negative : 1;
      }
      if (valueA > valueB) {
        return sortOrder === 'ASC' ? 1 : negative;
      }
      return 0;
    });

    unknownData.sort((a, b) => a.name.localeCompare(b.name));

    const unknownName = unknownData.map((planet) => planet.name);
    return [...knownData, ...unknownName];
  };

  const handleSort = () => {
    if (sortColumn) {
      setData(sortData(data));
      const newSortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
      setSortOrder(newSortOrder);
    }
  };

  // console.log(sortColumn);
  console.log(sortOrder);
  return (
    <div>
      <div>
        <select
          data-testid="column-sort"
          onChange={ (event) => setSortColumn(event.target.value) }
        >
          {originalOptions.map((option) => (
            <option key={ option } value={ option }>
              {option}
            </option>
          ))}
        </select>

        <div>
          <label>
            Ascending
            <input
              type="radio"
              value="ASC"
              data-testid="column-sort-input-asc"
              checked={ sortOrder === 'ASC' }
              onChange={ () => setSortOrder('ASC') }
            />
          </label>
          <label>
            Descending
            <input
              type="radio"
              value="DESC"
              data-testid="column-sort-input-desc"
              checked={ sortOrder === 'DESC' }
              onChange={ () => setSortOrder('DESC') }
            />
          </label>
        </div>
        <button
          data-testid="column-sort-button"
          onClick={ handleSort }
        >
          Sort
        </button>
      </div>
    </div>
  );
}

SortingComponent.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  setData: PropTypes.func.isRequired,
};

export default SortingComponent;
