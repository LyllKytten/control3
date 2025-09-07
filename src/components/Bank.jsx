import React, {memo, useEffect} from 'react';

import ClientTable from './ClientTable';
import { bankEvents } from './events';

import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyData } from '../redux/clientsSlice';

function Bank () {
    console.log("render: bank component");

    const dispatch = useDispatch();
    const companyName = useSelector(s => s.clients.companyName);
    const clients = useSelector(s => s.clients.clients);
    const status = useSelector(s => s.clients.status);
    const error = useSelector(s => s.clients.error);

    useEffect(() => {
        if (status === "idle") dispatch(fetchCompanyData());
    }, [status, dispatch]);

    const allButtonClicked = () => {
        console.log("------- all clients button pressed");
        bankEvents.emit('EAllClientsShow');
    };

    const activeButtonClicked = () => {
        console.log("------- active clients button pressed");
        bankEvents.emit('EActiveClientsShow');
    };

    const blockedButtonClicked = () => {
        console.log("------- blocked clients button pressed");
        bankEvents.emit('EBlockedClientsShow');
    };

    return (
        <div>
            <h2 style={{marginTop: 0}}>
                {status === 'loading' ? 'Загрузка…' : companyName}
            </h2>
            <input type="button" value="Все" onClick={allButtonClicked} />
            <input type="button" value="Активные" onClick={activeButtonClicked} />
            <input type="button" value="Заблокированные" onClick={blockedButtonClicked} />
            <hr />
            <ClientTable clients={clients}/>
        </div>
    );
}

export default memo(Bank);