import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { useFilterContext } from '../hooks/useFilterContext';

function Table() {
  const url = 'https://swapi.dev/api/planets';
  const planets = useFetch(url);
  const [data, setData] = useState(null);
  const { filterValue, setFilterValue } = useFilterContext();

  useEffect(() => {
    if (planets.isLoading === false && planets.data) {
      const planetData = planets.data.results.map((planet) => {
        const { residents, ...rest } = planet;
        return rest;
      });
      setData(planetData);
    }
  }, [planets.isLoading, planets.data]);

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
            {filteredData.length > 0 ? (
              filteredData.map((planet) => (
                <tr key={ planet.name }>
                  {headers.map((header) => (
                    <td key={ planet.name + header }>{planet[header]}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No planets found</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

    </>
  );
}
export default Table;
