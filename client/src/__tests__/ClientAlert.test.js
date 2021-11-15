
import React from 'react';
import {  render } from '@testing-library/react';
import ClientAlert from '../Components/ClientAlert'
const testClients = [{ client_id: 2, budget:0, name: "Atabay", surname: "Heydarli", gender: 1, birthday: "1999-01-15", country: "Italy",
region: "Piemonte",address: "Via Gambasca 19",city: "Torino"}];

test('Renders Correctly the client Reminder', () => { 
const renderResult = render(<ClientAlert clients={testClients}clientid={2}/>);
const AlertH = document.querySelector("[data-testid=alertH]");
const Alert = document.querySelector("[data-testid=alert]");
expect(AlertH.innerHTML).toBe("-ATTENTION-");
expect(Alert.innerHTML).toBe("Your wallet balance is insufficient. Please top it up!");

});