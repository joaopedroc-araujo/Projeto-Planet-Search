import React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { FilterProvider } from './hooks/useFilterContext';
import logo from './assets/generatedtext (1).png';
import PlanetsTable from './components/PlanetsTable';

function App() {
  return (
    <FilterProvider>
      <header className="header-logo">
        <img
          src={ logo }
          alt="Planet Search logo"
        />
      </header>
      <main>
        <PlanetsTable />
      </main>
    </FilterProvider>
  );
}

export default App;
