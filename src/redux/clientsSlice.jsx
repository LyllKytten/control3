import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';

export const fetchCompanyData = createAsyncThunk(
    'clients/fetchCompanyData',
    async() => {
        const url = 'https://fe.it-academy.by/Examples/mobile_company.json';
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data;
    }
);

const initialState = {
    companyName: '',     
    clients: [],        
    status: 'idle', 
    error: null,  
}

const clientsSlice = createSlice({
    name: "clients",
    initialState: initialState,
    reducers: {
        addClient: (state, action) => {
            state.clients.push(action.payload);
        },
        saveClient: (state, action) => {
            const updated = action.payload;
            state.clients = state.clients.map(c => 
                String(c.id) === String(updated.id) ? {...updated} : c
            );
        },
        deleteClient: (state, action) => {
            const id = action.payload;
            state.clients = state.clients.filter(c => String(c.id) !== String(id));
        },
    },
    extraReducers: builder => {
        builder 
            .addCase(fetchCompanyData.pending, s => {
                s.status = "loading"; 
                s.error = null;
            })
            .addCase(fetchCompanyData.fulfilled, (s, a) => {
                s.status = "succeeded";
                const payload = a.payload;

                s.companyName = String(payload.companyName);

                s.clients = payload.clientsArr;
            })
            .addCase(fetchCompanyData.rejected, (s, a) => {
                s.status = 'failed';
                s.error = a.error.message;
            });
    },
});

export const {addClient, saveClient, deleteClient} = clientsSlice.actions;
export default clientsSlice.reducer;