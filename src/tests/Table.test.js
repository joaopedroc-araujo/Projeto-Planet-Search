import React, { useState } from 'react';
// import { screen, waitFor, within } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { mockAPI } from './mocks/mockAPI';
// import { customRender } from './customRender/customRender';
// import App from '../App';
import { act, render, renderHook, waitFor } from '@testing-library/react';
import Table from '../components/Table';
import useFetch from '../hooks/useFetch';
import { mockAPI } from './mocks/mockAPI';
import { useFilterContext } from '../hooks/useFilterContext';
import { customRender } from './customRender/customRender';

jest.mock('../hooks/useFetch', () => jest.fn());

describe('useFetch', () => {
test('useFetch mostra mensagem de erro ao falhar', async () => {
  const fakeError = new Error('Network Error');
  jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject(fakeError));

  const { result } = renderHook(() => useFetch('https://fakeurl.com'));

  await waitFor(() => expect(result.current.error).toEqual(fakeError));
});

test('useFetch mostra os dados quando é chamado corretamente', async () => {
  jest.spyOn(global, 'fetch').mockImplementation(mockAPI);

  const { getByText } = customRender(<TestComponent url="/api/data" />);

  // Verifica se a mensagem de carregamento é exibida inicialmente
  expect(getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => {
    // Verifica se a função fetch foi chamada com a URL correta
    expect(global.fetch).toHaveBeenCalledWith('/api/data');
  });

  // Verifica se o componente agora exibe os dados mockados
  expect(getByText('Data: Mocked Data')).toBeInTheDocument();
});
});


