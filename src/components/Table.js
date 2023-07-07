import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { useFilterContext } from '../hooks/useFilterContext';

function Table() {
  const url = 'https://swapi.dev/api/planets';
  const planets = useFetch(url);
  const [data, setData] = useState(null);
  // const [changedData, setChangedData] = useState(null);
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
  } = useFilterContext();

  useEffect(() => {
    if (planets.isLoading === false && planets.data) {
      const planetData = planets.data.results.map((planet) => {
        const { residents, ...rest } = planet;
        return rest;
      });
      setData(planetData);
      // setChangedData(planetData);
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

  const filteredData = data.filter((planet) => planet.name.toLowerCase()
    .includes(filterValue.toLowerCase()));

  const headers = filteredData.length > 0 ? Object.keys(filteredData[0]) : [];

  const removeOption = () => {
    const updatedOptions = options.filter((option) => option !== column);

    // setColumn('population'); // Defina o valor inicial do select para "population"
    setOptions(updatedOptions);
  };

  const handleFilter = () => {
    removeOption();
    const newFilteredData = applyFilter(data);
    console.log(newFilteredData);
    setData(newFilteredData);
    // setColumn('');
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
          handleFilter();
        } }
        data-testid="button-filter"
      >
        Filter
      </button>
      <section>
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
                <tr key={ planet.name }>
                  {headers.map((header) => (
                    <td key={ planet.name + header }>{planet[header]}</td>
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
