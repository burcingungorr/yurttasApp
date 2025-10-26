import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

export const saveUsername = createAsyncThunk(
  'username/saveUsername',
  async (username, { rejectWithValue }) => {
    try {
      const userRef = firestore().collection('users');
      const snapshot = await userRef.where('name', '==', username).get();

      // Kullanıcı zaten varsa mevcut bilgileri döndür
      if (!snapshot.empty) {
        const existingUser = snapshot.docs[0].data();
        return { uid: existingUser.uid, name: existingUser.name };
      }

      // Yeni kullanıcı oluştur
      const uid = uuid.v4();
      await userRef.doc(uid).set({
        uid: uid,
        name: username,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      return { uid, name: username };
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
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.savedUsername = null;
      state.uid = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveUsername.fulfilled, (state, action) => {
        state.savedUsername = action.payload.name;
        state.uid = action.payload.uid;
        state.error = null;
      })
      .addCase(saveUsername.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearUser } = usernameSlice.actions;
export default usernameSlice.reducer;