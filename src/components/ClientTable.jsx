import React, { useEffect, useMemo, useState, memo } from "react";

import './ClientTable.css';
import Client from './Client';
import { bankEvents } from './events';

import { useDispatch } from "react-redux";
import { addClient, saveClient, deleteClient } from "../redux/clientsSlice"

function ClientTable ({clients}) {
    console.log("render: client table");

    const dispatch = useDispatch();
    const [visibleIds, setVisibleIds] = useState(() => clients.map(c => String(c.id)));

    useEffect(() => {
        setVisibleIds(clients.map(c => String(c.id)));
    }, [clients]);

    useEffect(() => {
        const handleAll = () => {
            setVisibleIds(clients.map(c => String(c.id)));
        };

        const handleActive = () => {
            setVisibleIds(clients.filter(c => Number(c.balance) >= 0).map(c => String(c.id)));
        };

        const handleBlocked = () => {
            setVisibleIds(clients.filter(c => Number(c.balance) < 0).map(c => String(c.id)));
        };

        const handleDelete = (deleteId) => {
            dispatch(deleteClient(deleteId));
            setVisibleIds(prev => prev.filter(id => String(id) !== String(deleteId)));
        };

        const handleSaveChanges = (clientObject) => {
            dispatch(saveClient(clientObject));
        };

        bankEvents.addListener("EAllClientsShow", handleAll);
        bankEvents.addListener("EActiveClientsShow", handleActive);
        bankEvents.addListener("EBlockedClientsShow", handleBlocked);
        bankEvents.addListener("EDeleteClient", handleDelete);
        bankEvents.addListener("ESaveClientChanges", handleSaveChanges);

        return () => {
            bankEvents.removeListener("EAllClientsShow", handleAll);
            bankEvents.removeListener("EActiveClientsShow", handleActive);
            bankEvents.removeListener("EBlockedClientsShow", handleBlocked);
            bankEvents.removeListener("EDeleteClient", handleDelete);
            bankEvents.removeListener("ESaveClientChanges", handleSaveChanges);
        };
    }, [clients, dispatch]);

    const addNewClientButtonClicked = () => {
        const maxId = clients.reduce((m, c) => Math.max(m, Number(c.id) || 0), 0);
        const newId = String(maxId + 1);

        dispatch(addClient({
            id: `${newId}`, 
            fam: "Фамилия", 
            im: "Имя", 
            otch: "Отчество", 
            balance: "0"
        }));
        setVisibleIds(old => [...old, newId]);

        setTimeout(() => bankEvents.emit("EChangeNewClient", newId), 0);
    };

    const rows = useMemo(() => {
        return clients.map(client => visibleIds.includes(String(client.id)) ? (
                <Client key={client.id} clientRef={client} />
            ) : null
        );
    }, [clients, visibleIds]);

    return (
        <div>
                <table border={1} style={{borderCollapse: "collapse", width: "90%", textAlign: "left"}}> 
                    <tbody>
                        <tr>
                            <th>Фамилия</th>
                            <th>Имя</th>
                            <th>Отчество</th>
                            <th style={{width: "80px"}}>Баланс</th>
                            <th style={{width: "80px"}}>Статус</th>
                            <th style={{width: "155px"}}>Редактировать</th>
                            <th style={{width: "65px"}}>Удалить</th>
                        </tr>
                        {rows}
                    </tbody>
                </table>
                <hr />
                <input type="button" value="Добавить клиента" onClick={addNewClientButtonClicked} />
            </div>
    );
}

export default memo(ClientTable);