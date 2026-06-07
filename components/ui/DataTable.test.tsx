import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from './DataTable';

describe('DataTable', () => {
  it('renders correctly', () => {
    const columns = [{ key: 'name', header: 'Name' }];
    const data = [{ name: 'Test' }];
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});