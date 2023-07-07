import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { useFilterContext } from '../hooks/useFilterContext';

function Table() {
  const url = 'https://swapi.dev/api/planets';
  const planets = useFetch(url);
  const [data, setData] = useState(null);
  // const [changedData, setChangedData] = useState(null);

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
    selectedColumns,
    setSelectedColumns,
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
    if (data) {
      const allColumns = data.length > 0 ? Object.keys(data[0]) : [];
      const remainingColumns = allColumns.filter(
        (col) => !selectedColumns.includes(col),
      );
      if (remainingColumns.length === 0) {
        setColumn('');
      } else if (!remainingColumns.includes(column)) {
        setColumn(remainingColumns[0]);
      }
    }
  }, [data, selectedColumns, column, setColumn]);

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

  const handleFilter = () => {
    const newFilteredData = applyFilter(data);
    console.log(newFilteredData);
    setData(newFilteredData);
  };
  const handleColumnChange = (selectedColumn) => {
    setColumn(selectedColumn);
    // setValue(0);
  };

  const handleApplyFilter = () => {
    if (!selectedColumns.includes(column)) {
      setSelectedColumns([...selectedColumns, column]);
    }
    handleFilter();
    console.log(filteredData);
    // setValue(0);
  };

  const availableColumns = ['population', 'orbital_period',
    'diameter', 'rotation_period', 'surface_water'];

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
          onChange={ ({ target }) => handleColumnChange(target.value) }
          data-testid="column-filter"
        >
          {availableColumns.map((col) => (
            !selectedColumns.includes(col) && (
              <option key={ col } value={ col }>
                {col}
              </option>
            )
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
          type="number"
          value={ value }
          onChange={ ({ target }) => setValue(target.value) }
          data-testid="value-filter"
        />
      </div>

      <button
        onClick={ handleApplyFilter }
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
