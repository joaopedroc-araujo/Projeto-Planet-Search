import React from 'react';
import './App.css';
import Table from './components/Table';
import { FilterProvider } from './hooks/useFilterContext';

function App() {
  return (
    <FilterProvider>
      <header>Projeto Star Wars</header>
      <main>
        <Table />
      </main>
    </FilterProvider>
  );
}

export default App;
