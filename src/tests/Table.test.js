import React, { useState } from 'react';

import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import Table from '../components/Table';
import useFetch from '../hooks/useFetch';
import { mockAPI } from './mocks/mockAPI';
import { FilterProvider, useFilterContext } from '../hooks/useFilterContext';
import { customRender } from './customRender/customRender';
import App from '../App';
import userEvent from '@testing-library/user-event';



describe('useFetch', () => {
  jest.setTimeout(10000)
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockAPI),
      })
    );
  });

  test('useFetch mostra a resposta corretamente', async () => {
    const { result } = renderHook(() =>
      useFetch('https://example.com/data')
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockAPI);
    expect(result.current.error).toBe(null);
  });

  // test('useFetch mostra o erro corretamente', async () => {
  //   const { result, waitFor } = renderHook(() =>
  //     useFetch('https://example.com/data')
  //   );

  //   await waitFor(() => result.current.error);

  //   expect(result.current.error).toEqual(new Error('Erro ao buscar dados'));
  // });

  test('testa se o array de planetas é chamado no data', async () => {
    renderHook(() => useFetch('https://example.com/data'));


    await act(async () => {
      render(
        <FilterProvider>
          <Table />
        </FilterProvider>
      );
    });

    expect(screen.getByText('Tatooine')).toBeInTheDocument();
    expect(screen.getByText('200000')).toBeInTheDocument();
    expect(screen.getByText('Alderaan')).toBeInTheDocument();
    expect(screen.getByText('2000000000')).toBeInTheDocument();

    const nameFilter = screen.getByTestId('name-filter');
    expect(nameFilter).toBeInTheDocument();
  });

  test('testa se salva os filtros no estado corretamente', async () => {
    renderHook(() => useFetch('https://example.com/data'));

    await act(async () => {
      render(
        <FilterProvider>
          <Table />
        </FilterProvider>
      );
    });

    const comparisonFilter = screen.getByTestId('comparison-filter');
    fireEvent.change(comparisonFilter, { target: { value: 'menor que' } });

    expect(comparisonFilter.value).toBe('menor que');

    const valueFilter = screen.getByTestId('value-filter');
    fireEvent.change(valueFilter, { target: { value: '100' } });

    expect(valueFilter.value).toBe('100');
  });

  test('testa se aparece uma mensagem de erro quando a chamada a API falha', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Erro ao buscar dados'))
    );
    renderHook(() => useFetch('https://example.com/data'));

    await act(async () => {
      render(
        <FilterProvider>
          <Table />
        </FilterProvider>
      );
    });

    expect(await screen.findByText('"I felt a great disturbance in the Force, as if millions of voices suddenly cried out in terror and were suddenly silenced. I fear something terrible has happened." ―Obi-Wan Kenobi, sensing the destruction of Alderaan.')).toBeInTheDocument();
  });

  test('testa se salva os filtros no estado corretamente', async () => {
    renderHook(() => useFetch('https://example.com/data'));

    await act(async () => {
      render(
        <FilterProvider>
          <Table />
        </FilterProvider>
      );
    });

    const columnFilter = screen.getByTestId('column-filter');
    fireEvent.change(columnFilter, { target: { value: 'population' } });

    const filterBtn = screen.getByRole('button', { name: 'Filter' });
    fireEvent.click(filterBtn);

    expect(columnFilter).not.toHaveTextContent('population');
  });
});




