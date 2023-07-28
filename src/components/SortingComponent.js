import { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { originalOptions } from '../helpers/originalOptions';
import './SortingComponent.css';

function SortingComponent({ data, setData }) {
  const [sortColumn, setSortColumn] = useState('population');
  const [sortOrder, setSortOrder] = useState('ASC');

  const negative = -1;
  const sortData = (newData) => {
    const knownData = newData.filter((planet) => planet[sortColumn] !== 'unknown');
    const unknownData = newData.filter((planet) => planet[sortColumn] === 'unknown');

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

    return [...knownData, ...unknownData];
  };

  const handleSort = () => {
    if (sortColumn) {
      setData(sortData(data));
      const newSortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
      setSortOrder(newSortOrder);
    }
  };

  return (
    <div className="sorting-component">
      <Form.Select
        className="select"
        aria-label="Default select example"
        data-testid="column-sort"
        onChange={ (event) => setSortColumn(event.target.value) }
      >
        {originalOptions.map((option) => (
          <option key={ option } value={ option }>
            {option}
          </option>
        ))}
      </Form.Select>
      <label>
        <FontAwesomeIcon
          icon={ sortOrder === 'ASC' ? faCaretUp : faCaretDown }
          size="2xl"
          className="up"
        />
        <input
          className="asc-checkbox"
          type="checkbox"
          value={ sortOrder }
          data-testid="column-sort-input-asc"
          checked={ sortOrder === 'ASC' }
          onChange={ () => {
            const newSortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
            setSortOrder(newSortOrder);
            handleSort();
          } }
        />
      </label>
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
