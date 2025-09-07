import React, { useEffect, useRef, useState, memo } from 'react';

import "./Client.css";
import { bankEvents } from './events';

function Client ({clientRef}) {
    console.log("render: Client " + clientRef.im);

    const [mode, setMode] = useState(1);  // 1 - view, 2 - edit

    const refSurname = useRef(null);
    const refFirstName = useRef(null);
    const refLastName = useRef(null);
    const refBalance = useRef(null);

    useEffect(() => {
        const changeModeIfMe = (idNewClient) => {
            if (String(clientRef.id) === String(idNewClient)) setMode(2);
        };

        bankEvents.addListener('EChangeNewClient', changeModeIfMe);

        return () => bankEvents.removeListener('EChangeNewClient', changeModeIfMe);
    }, [clientRef.id]);

    const editButtonPressed = () => setMode(2);

    const deleteButtonPressed = () => {
        if (confirm(`Вы действительно хотите удалить клиента ${clientRef.fam} ${clientRef.im} ${clientRef.otch}?`)) {
            bankEvents.emit("EDeleteClient", clientRef.id);
        }
    };

    const cancelButtonPressed = () => setMode(1);

    const saveButtonPressed = () => {
        const newSurname = refSurname.current.value;
        const newFirstName = refFirstName.current.value;
        const newLastName = refLastName.current.value;
        const newBalance = refBalance.current.value;

        const updated = {
            ...clientRef, 
            fam: newSurname,
            im: newFirstName,
            otch: newLastName,
            balance: newBalance,
        };

        bankEvents.emit("ESaveClientChanges", updated);
        setMode(1);
    };

    const balanceNum = Number(clientRef.balance);
    const isActive = balanceNum >= 0;

    if (mode === 1) {
        return (
            <tr>
                <td>{clientRef.fam}</td>
                <td>{clientRef.im}</td>
                <td>{clientRef.otch}</td>
                <td>{clientRef.balance}</td>
                <td style={{backgroundColor: clientRef.balance >= 0 ? "green":"red"}}>{clientRef.balance >=0 ? "active" : "blocked"}</td>
                <td><input type="button" value="Редактировать" onClick={editButtonPressed}/></td>
                <td><input type="button" value="Удалить" onClick={deleteButtonPressed}/></td>
            </tr>
        );
    }
    return (
        <tr>
            <td><input className="clientTextInput" type="text" defaultValue={clientRef.fam} ref={refSurname} /></td>
            <td><input className="clientTextInput" type="text" defaultValue={clientRef.im} ref={refFirstName} /></td>
            <td><input className="clientTextInput" type="text" defaultValue={clientRef.otch} ref={refLastName} /></td>
            <td><input className="clientBalanceInput" type="text" defaultValue={clientRef.balance} ref={refBalance} /></td>
            <td style={{backgroundColor: clientRef.balance >= 0 ? "green":"red"}}>{clientRef.balance >=0 ? "active" : "blocked"}</td>
            <td>
                <input type="button" value="Отмена" onClick={cancelButtonPressed} style={{marginRight: "10px"}}/>
                <input type="button" value="Сохранить" onClick={saveButtonPressed}/>
            </td>
            <td><input type="button" value="Удалить" onClick={deleteButtonPressed}/></td>
        </tr>
    );
}

export default memo(Client);