/* eslint-disable max-lines */
import { useEffect, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useFilterContext } from '../hooks/useFilterContext';
import SortingComponent from './SortingComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PlanetsTable.css';
import { planetsImages } from '../helpers/planetsImages';
import useFetch from '../hooks/useFetch';

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
    setValue('');
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
          className="name-input"
          type="text"
          value={ filterValue }
          placeholder="Planet name"
          data-testid="name-filter"
          onChange={ ({ target }) => setFilterValue(target.value) }
        />
      </div>
      <div className="filter-div">
        <Form.Select
          aria-label="Default select example"
          value={ column }
          onChange={ ({ target }) => setColumn(target.value) }
          data-testid="column-filter"
        >
          {options.map((option) => (
            <option value={ option } key={ option }>
              {option}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          aria-label="Default select example"
          value={ comparison }
          onChange={ ({ target }) => setComparison(target.value) }
          data-testid="comparison-filter"
        >
          <option value="maior que">maior que</option>
          <option value="menor que">menor que</option>
          <option value="igual a">igual a</option>
        </Form.Select>
        <div>
          <input
            className="value-input"
            type="text"
            placeholder="Value"
            value={ value }
            onChange={ ({ target }) => setValue(target.value) }
            data-testid="value-filter"
            style={ { backgroundColor: 'black', color: 'yellow' } }
          />
        </div>
      </div>
      <div className="button-divs">
        <Button
          variant="outline-warning"
          onClick={ () => {
            removeOption();
            handleFilter();
          } }
          data-testid="button-filter"
        >
          Filter
        </Button>
        {appliedFilters.map((filter) => (
          <span
            key={ filter.column }
            data-testid="filter"
          >
            <Button
              variant="outline-warning"
              onClick={ () => removeFilter(filter.column) }
            >
              {filter.column}
              {' '}
              {filter.comparison}
              {' '}
              {filter.value}
            </Button>
          </span>
        ))}
        <Button
          variant="outline-warning"
          data-testid="button-remove-filters"
          onClick={ () => removeAllFilters() }
        >
          Remover todas filtragens
        </Button>
      </div>
      <SortingComponent data={ data } setData={ setData } />
      <section className="card-section">
        {filteredData.length === 0 ? (
          <h3>No planets found</h3>
        ) : (
          filteredData.map((planet) => (
            <div className="card-container" key={ planet.name }>
              <Card
                style={ { width: '30rem' } }
                className="text-center planet-card"
                key={ planet.name }
              >
                <Card.Img
                  variant="top"
                  src={ planetsImages[0][planet.name] }
                  alt={ `${planet.name} picture` }
                  className="planet-card-image"
                />
                <Card.Body className="card-body">
                  <Card.Title className="card-title">{planet.name}</Card.Title>
                  <Card.Text className="planet-card-text">
                    <p>
                      Population:
                      {' '}
                      {planet.population}
                    </p>
                    <p>
                      Climate:
                      {' '}
                      {planet.climate}
                    </p>
                    <p>
                      Terrain:
                      {' '}
                      {planet.terrain}
                    </p>
                    <p>
                      Rotation Period:
                      {' '}
                      {planet.rotation_period}
                    </p>
                    <p>
                      Orbital Period:
                      {' '}
                      {planet.orbital_period}
                    </p>
                    <p>
                      Diameter:
                      {' '}
                      {planet.diameter}
                    </p>
                    <p>
                      Surface Water:
                      {' '}
                      {planet.surface_water}
                    </p>
                    <p>
                      Gravity:
                      {' '}
                      {planet.gravity}
                    </p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          )))}
      </section>
    </>

  );
}

export default PlanetsTable;
