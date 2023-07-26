/* eslint-disable max-lines */
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import useFetch from '../hooks/useFetch';
import { useFilterContext } from '../hooks/useFilterContext';
import SortingComponent from './SortingComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PlanetsTable.css';

function PlanetsTable() {
  const url = 'https://swapi.dev/api/planets';
  const planets = useFetch(url);
  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
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
    }
  }, [planets.isLoading, planets.data]);

  useEffect(() => {
    if (!options.includes(column)) {
      setColumn(options[0]);
    }
  }, [options, column, setColumn]);

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
  if (!data) {
    return <Spinner animation="grow" variant="warning" />;
  }

  const filteredData = data.filter((planet) => planet.name && planet.name.toLowerCase()
    .includes(filterValue.toLowerCase()));

  // console.log(headers);
  const removeOption = () => {
    const updatedOptions = options.filter((option) => option !== column);

    setOptions(updatedOptions);
  };

  const handleFilter = () => {
    const newFilteredData = applyFilter(data);
    setData(newFilteredData);
    setValue(0);
  };

  const reapplyFilters = (reapplyData, filters) => {
    let newData = reapplyData;

    filters.forEach(({ column: reappliedColumn, comparison: reappliedComparison,
      value: reappliedValue }) => {
      const parsedValue = parseFloat(reappliedValue);

      if (!Number.isNaN(parsedValue)) {
        if (reappliedComparison === 'maior que') {
          newData = newData
            .filter((planet) => parseFloat(planet[reappliedColumn]) > parsedValue);
        } else if (reappliedComparison === 'menor que') {
          newData = newData
            .filter((planet) => parseFloat(planet[reappliedColumn]) < parsedValue);
        } else if (reappliedComparison === 'igual a') {
          newData = newData
            .filter((planet) => parseFloat(planet[reappliedColumn]) === parsedValue);
        }
      }
    });

    return newData;
  };

  const removeFilter = (columnToRemove) => {
    setData(originalData);
    const updatedFilters = appliedFilters
      .filter((filter) => filter.column !== columnToRemove);
    setAppliedFilters(updatedFilters);

    if (!options.includes(columnToRemove)) {
      setOptions([...options, columnToRemove]);
    }

    const newFilteredData = reapplyFilters(originalData, updatedFilters);
    setData(newFilteredData);
  };

  const removeAllFilters = () => {
    setData(originalData);
    setAppliedFilters([]);
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
        onClick={ () => removeAllFilters() }
      >
        Remover todas filtragens
      </button>
      <section>
        <SortingComponent data={ data } setData={ setData } />
        <Card style={ { width: '18rem' } }>
          {filteredData.length === 0 ? (
            <h3>No planets found</h3>
          ) : (
            filteredData.map((planet) => (
              <>
                <Card.Img
                  key={ planet.name }
                  variant="top"
                  src="holder.js/100px180"
                />
                <Card.Body>
                  <Card.Title>{planet.name}</Card.Title>
                  <br />
                  <Card.Text>
                    Population:
                    {' '}
                    {planet.population}
                  </Card.Text>
                  <Card.Text>
                    Climate:
                    {' '}
                    {planet.climate}
                  </Card.Text>
                  <br />
                  <Card.Text>
                    Terrain:
                    {' '}
                    {planet.terrain}
                  </Card.Text>
                  <br />
                  <Card.Text>
                    Rotation Period:
                    {' '}
                    {planet.rotation_period}
                  </Card.Text>
                  <br />
                  <Card.Text>
                    Orbital Period:
                    {' '}
                    {planet.orbital_period}
                  </Card.Text>
                  <br />
                  <Card.Text>
                    Diameter:
                    {' '}
                    {planet.diameter}
                  </Card.Text>
                  <br />
                  <Card.Text>
                    Surface Water:
                    {' '}
                    {planet.surface_water}
                  </Card.Text>
                  <br />
                  <Card.Text>
                    Gravity:
                    {' '}
                    {planet.gravity}
                  </Card.Text>
                </Card.Body>

              </>
            )))}
        </Card>
      </section>

    </>

  );
}

export default PlanetsTable;