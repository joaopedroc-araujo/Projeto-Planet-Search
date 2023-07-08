import { useEffect, useState } from 'react';
// import { originalOptions } from '../helpers/originalOptions';
import useFetch from '../hooks/useFetch';
import { useFilterContext } from '../hooks/useFilterContext';
import SortingComponent from './SortingComponent';

function Table() {
  const url = 'https://swapi.dev/api/planets';
  const planets = useFetch(url);
  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  // const [previousState, setPreviousState] = useState([]);
  const [options, setOptions] = useState([
    'population',
    'orbital_period',
    'diameter',
    'rotation_period',
    'surface_water',
  ]);

  const {
    filterValue,
    setFilterValue,
    column,
    setColumn,
    comparison,
    setComparison,
    value,
    setValue,
    applyFilter,
    appliedFilters,
    setAppliedFilters,
  } = useFilterContext();

  useEffect(() => {
    if (planets.isLoading === false && planets.data) {
      const planetData = planets.data.results.map((planet) => {
        const { residents, ...rest } = planet;
        return rest;
      });
      setData(planetData);
      setOriginalData(planetData);
      // console.log(originalData);
    }
  }, [planets.isLoading, planets.data]);

  useEffect(() => {
    if (!options.includes(column)) {
      setColumn(options[0]);
    }
  }, [options, column, setColumn]);

  if (!data) {
    return <p>Loading...</p>;
  }

  if (planets.error) {
    return (
      <span>
        &quot;I felt a great disturbance in the Force,
        as if millions of voices suddenly cried out
        in terror and were suddenly silenced.
        I fear something terrible has happened.&quot;
        ―Obi-Wan Kenobi, sensing the destruction of Alderaan.
      </span>
    );
  }

  const filteredData = data.filter((planet) => planet.name && planet.name.toLowerCase()
    .includes(filterValue.toLowerCase()));
  const headers = filteredData.length > 0 ? Object.keys(filteredData[0]) : [];

  const removeOption = () => {
    const updatedOptions = options.filter((option) => option !== column);

    setOptions(updatedOptions);
  };

  const removeFilter = (columnToRemove) => {
    const updatedFilters = appliedFilters
      .filter((filter) => filter.column !== columnToRemove);
    setAppliedFilters(updatedFilters);
    const newData = [...originalData];
    updatedFilters.forEach((filter) => {
      applyFilter(newData, filter);
    });
    setData(newData);

    if (!options.includes(columnToRemove)) {
      setOptions([...options, columnToRemove]);
    }
  };

  const handleFilter = () => {
    const newFilteredData = applyFilter(originalData);
    console.log(originalData);
    console.log(appliedFilters);
    setData(newFilteredData);
    setValue(0);
  };

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={ filterValue }
          data-testid="name-filter"
          onChange={ ({ target }) => setFilterValue(target.value) }
        />
      </div>
      <div>
        <select
          value={ column }
          onChange={ ({ target }) => setColumn(target.value) }
          data-testid="column-filter"
        >
          {options.map((option) => (
            <option value={ option } key={ option }>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <select
          value={ comparison }
          onChange={ ({ target }) => setComparison(target.value) }
          data-testid="comparison-filter"
        >
          <option value="maior que">maior que</option>
          <option value="menor que">menor que</option>
          <option value="igual a">igual a</option>
        </select>
      </div>
      <div>
        <input
          type="text"
          value={ value }
          onChange={ ({ target }) => setValue(target.value) }
          data-testid="value-filter"
        />
      </div>

      <button
        onClick={ () => {
          removeOption();
          handleFilter();
        } }
        data-testid="button-filter"
      >
        Filter
      </button>
      {appliedFilters.map((filter) => (
        <span
          key={ filter.column }
          data-testid="filter"
        >
          <button
            onClick={ () => removeFilter(filter.column) }
          >
            {filter.column}
            {' '}
            {filter.comparison}
            {' '}
            {filter.value}
            {' '}
            x
          </button>
        </span>
      ))}
      <button
        data-testid="button-remove-filters"
      >
        Remover todas filtragens
      </button>
      <section>
        <SortingComponent data={ data } setData={ setData } />
        <table>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={ header }>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={ headers.length }>No planets found</td>
              </tr>
            ) : (
              filteredData.map((planet) => (
                <tr
                  key={ planet.name }
                  data-testid="planet-name"
                >
                  {headers.map((header) => (
                    <td
                      key={ planet.name + header }
                    >
                      {planet[header]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

    </>

  );
}
export default Table;
