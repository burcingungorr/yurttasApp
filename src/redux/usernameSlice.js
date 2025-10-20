import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

export const saveUsername = createAsyncThunk(
    'username/saveUsername',
    async (username, { rejectWithValue }) => {
        try {
            const userRef = firestore().collection('users');
            const snapshot = await userRef.where('name', '==', username).get();

            if (!snapshot.empty) {
                const existingUser = snapshot.docs[0].data();

                return { uid: existingUser.uid, name: existingUser.name, message: 'Hesabın zaten var. Odaya giriş yapabilirsiniz.' };
            } else {
                const uid = uuid.v4();
                await userRef.doc(uid).set({
                    uid: uid,
                    name: username,
                });
                return { uid, name: username, message: 'Kayıt oluşturuldu! Odaya giriş yapabilirsiniz.' };
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const usernameSlice = createSlice({
    name: 'username',
    initialState: {
        savedUsername: null,
        uid: null,
        message: null,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(saveUsername.fulfilled, (state, action) => {
                state.savedUsername = action.payload.name;
                state.uid = action.payload.uid;
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(saveUsername.rejected, (state, action) => {
                state.error = action.payload;
                state.message = null;
            });
    },
});

export default usernameSlice.reducer;
