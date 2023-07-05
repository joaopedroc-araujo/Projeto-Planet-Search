import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';

function Table() {
  const url = 'https://swapi.dev/api/planets';
  const planets = useFetch(url);
  const [data, setData] = useState(null);
  // if (planets.isLoading === true) return <p>Loading...</p>;
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

  const headers = Object.keys(data[0]);

  return (
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={ header }>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data
          && data.map((planet) => (
            <tr key={ planet.name }>
              {headers.map((header) => (
                <td key={ planet.name + header }>{planet[header]}</td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
}
export default Table;
