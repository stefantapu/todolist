import { cleanup, render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import { About } from './About';
import { afterEach, describe, expect, test } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

describe('About componenet', () => {
  afterEach(cleanup); //очистка экрана, компонентов после каждого теста
  test('renders correctly', () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );
    const heading = screen.getByTestId('version-container');
    expect(heading).toBeDefined();
  });
  test('increment counter', () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );
    const count = screen.getByTestId('counter');
    const countContent = count.textContent;
    expect(countContent).toBe('0');
    expect(countContent).not.toBeNull();

    const button = screen.getByTestId('increment-button');
    fireEvent.click(button);

    const newCount = screen.getByTestId('counter');
    const newCountContent = newCount.textContent;
    expect(newCountContent).toBe('1');
    expect(newCountContent).not.toBeNull();
    expect(newCountContent).not.toBe(countContent);
  });
});
