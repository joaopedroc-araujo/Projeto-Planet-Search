import React from 'react';
import { render } from '@testing-library/react';
import { FilterProvider } from '../../hooks/useFilterContext';


export const customRender = (component) => {
  return render(<FilterProvider>{component}</FilterProvider>);
};
