import { render, renderHook, screen, waitFor } from "@testing-library/react";
import Table from "../components/Table";
import useFetch from "../hooks/useFetch";
import { FilterProvider } from "../hooks/useFilterContext";

// const {data, isLoading, error} = renderHook(() => useFetch());
const url = 'https://swapi.dev/api/planets';

describe('Table', () => {
  test('se o texto loading está na tela', async () => {
    render(
      <FilterProvider>
        <Table />
      </FilterProvider>
    );

    const loadingMsg = screen.getByText('Loading...');
    expect(loadingMsg).toBeInTheDocument();
  });

  test('se o texto de erro está na tela', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('API Error'));
    const { result } = renderHook(() => useFetch(url));
    console.log(result)
    render(
      <FilterProvider>
        <Table />
      </FilterProvider>
    );
    const {setIsLoading, setError} = result.current;
    console.log(setIsLoading, setError)
    await waitFor(() => result.current.error !== null);
    const errorMsg = screen.getByText(/I felt a great disturbance in the Force/i);
    expect(errorMsg).toBeInTheDocument();
  });
});

