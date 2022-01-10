import React from 'react';
import { render } from '@testing-library/react';
import Frontpage from '../Components/Frontpage'

test('Renders Frontpage correctly', () => {
    const renderResult = render(<Frontpage></Frontpage>);
    expect(renderResult.getByText("Clients area")).toBeInTheDocument();
    expect(renderResult.getByText("Producers area")).toBeInTheDocument();
    expect(renderResult.getByText("Staff area")).toBeInTheDocument();
    expect(renderResult.getByText("Store personnel")).toBeInTheDocument();
    expect(renderResult.getByText("Warehouse personnel")).toBeInTheDocument();
    expect(renderResult.getByText("Delivery personnel")).toBeInTheDocument();
    expect(renderResult.getByText("Want to work with us?")).toBeInTheDocument();
    expect(renderResult.getByText("Meet our products")).toBeInTheDocument();
    expect(renderResult.getByText("The producers")).toBeInTheDocument();

});
