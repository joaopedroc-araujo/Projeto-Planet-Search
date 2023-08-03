import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FilterProvider } from './hooks/useFilterContext';
import logo from './assets/generatedtext (1).png';
// eslint-disable-next-line max-len
import backgroundImage from './assets/star-wars-space-background-1920-x-1080-f1o3qr8zm0z4662c (1).jpg';
import PlanetsTable from './components/PlanetsTable';

function App() {
  return (
    <FilterProvider>
      <img
        src={ backgroundImage }
        alt="Background"
        className="bg-image sm:h-full sm:object-cover"
      />
      <header
        className="header-logo"
      >
        <img
          src={ logo }
          alt="Planet Search logo"
          className="w-72 md:w-96 lg:w-1/2 xl:w-1/3 "
        />
      </header>
      <main>
        <PlanetsTable />
      </main>
    </FilterProvider>
  );
}

export default App;
