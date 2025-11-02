import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

export const saveUsername = createAsyncThunk(
  'username/saveUsername',
  async (username, { rejectWithValue }) => {
    try {
      const normalizeName = (name) =>
        name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

      const userRef = firestore().collection('users');
      const snapshot = await userRef.get();

      const normalizedNew = normalizeName(username);

      const nameExists = snapshot.docs.some((doc) => {
        const savedName = doc.data().name;
        return normalizeName(savedName) === normalizedNew;
      });

      if (nameExists) {
        return rejectWithValue('Bu kullanıcı adı alınmış. Başka bir isim girin.');
      }

      const uid = uuid.v4();
      await userRef.doc(uid).set({
        uid,
        name: username,
        normalizedName: normalizedNew,
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
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearUser } = usernameSlice.actions;
export default usernameSlice.reducer;
