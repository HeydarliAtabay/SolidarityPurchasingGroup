import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Navbar from '../Components/MyNavbar'

const time = { day: 'monday', hour: '10' };

function setTime(time) {
    return 0;
}

test('Renders Frontpage correctly', () => {
    const renderResult = render(<Navbar time={time} setTime={setTime} />);
    expect(renderResult.getByText("Solidarity Purchasing Group")).toBeInTheDocument();
    expect(renderResult.getByText("Home")).toBeInTheDocument();
    expect(renderResult.getByText("Client")).toBeInTheDocument();
    expect(renderResult.getByText("Staff")).toBeInTheDocument();
    expect(renderResult.getByText("Farmer")).toBeInTheDocument();

    expect(renderResult.getByText('Monday')).toBeInTheDocument();
    expect(renderResult.getByText('Tuesday')).toBeInTheDocument();
    expect(renderResult.getByText('Wednesday')).toBeInTheDocument();
    expect(renderResult.getByText('Thursday')).toBeInTheDocument();
    expect(renderResult.getByText('Friday')).toBeInTheDocument();
    expect(renderResult.getByText('Saturday')).toBeInTheDocument();
    expect(renderResult.getByText('Sunday')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Home'));
    fireEvent.click(screen.getByText('Client'));
    fireEvent.click(screen.getByText('Staff'));
    fireEvent.click(screen.getByText('Farmer'));

    fireEvent.click(screen.getByText('Monday'));
    fireEvent.click(screen.getByText('Tuesday'));
    fireEvent.click(screen.getByText('Wednesday'));
    fireEvent.click(screen.getByText('Thursday'));
    fireEvent.click(screen.getByText('Friday'));
    fireEvent.click(screen.getByText('Saturday'));
    fireEvent.click(screen.getByText('Sunday'));

    fireEvent.click(screen.getByText('00:00'));
    fireEvent.click(screen.getByText('01:00'));
    fireEvent.click(screen.getByText('02:00'));
    fireEvent.click(screen.getByText('03:00'));
    fireEvent.click(screen.getByText('04:00'));
    fireEvent.click(screen.getByText('05:00'));
    fireEvent.click(screen.getByText('06:00'));
    fireEvent.click(screen.getByText('07:00'));
    fireEvent.click(screen.getByText('08:00'));
    fireEvent.click(screen.getByText('09:00'));
    fireEvent.click(screen.getByText('10:00'));
    fireEvent.click(screen.getByText('11:00'));
    fireEvent.click(screen.getByText('12:00'));
    fireEvent.click(screen.getByText('13:00'));
    fireEvent.click(screen.getByText('14:00'));
    fireEvent.click(screen.getByText('15:00'));
    fireEvent.click(screen.getByText('16:00'));
    fireEvent.click(screen.getByText('17:00'));
    fireEvent.click(screen.getByText('18:00'));
    fireEvent.click(screen.getByText('19:00'));
    fireEvent.click(screen.getByText('20:00'));
    fireEvent.click(screen.getByText('21:00'));
    fireEvent.click(screen.getByText('22:00'));
    fireEvent.click(screen.getByText('23:00'));
    
});
