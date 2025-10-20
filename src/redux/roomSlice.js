import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';


export const createRoom = createAsyncThunk('room/createRoom', async ({ name, code }) => {
    const roomRef = firestore()
    .collection('rooms')
    .doc(code);

    await roomRef.set({ name, code });
    return { name, code };
});


export const joinRoom = createAsyncThunk('room/joinRoom', async ({ code, username }) => {
    const roomRef = firestore()
    .collection('rooms')
    .doc(code);

    const doc = await roomRef.get();
    
    if (!doc.exists) throw new Error('Oda bulunamadı.');
    return { code, username, name: doc.data().name };
});


const roomSlice = createSlice({
    name: 'room',
    initialState: { currentRoom: null, error: '' },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(createRoom.fulfilled, (state, action) => {
                state.currentRoom = action.payload;
                state.error = '';
            })
            .addCase(joinRoom.fulfilled, (state, action) => {
                state.currentRoom = action.payload;
                state.error = '';
            })
            .addCase(createRoom.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(joinRoom.rejected, (state, action) => {
                state.error = action.error.messageS;
            });
    }
});

export default roomSlice.reducer;
