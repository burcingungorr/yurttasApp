import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

export const createRoom = createAsyncThunk(
  'room/createRoom',
  async ({ name, code }, { rejectWithValue }) => {
    try {
      const roomsSnapshot = await firestore().collection('rooms').get();

      const nameExists = roomsSnapshot.docs.some(
        doc => doc.data().name.toLowerCase() === name.toLowerCase()
      );

      if (nameExists) {
        return rejectWithValue('Bu oda adı alınmış. Lütfen başka bir isim girin.');
      }

      const roomRef = firestore().collection('rooms').doc(code);
      await roomRef.set({ name, code });

      return { name, code };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinRoom = createAsyncThunk(
  'room/joinRoom',
  async ({ code, username }, { rejectWithValue }) => {
    try {
      const roomRef = firestore().collection('rooms').doc(code);
      const doc = await roomRef.get();

      if (!doc.exists) return rejectWithValue('Oda bulunamadı.');
      return { code, username, name: doc.data().name };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const roomSlice = createSlice({
  name: 'room',
  initialState: { currentRoom: null, error: '' },
  reducers: {
    clearRoom: (state) => {
      state.currentRoom = null;
      state.error = '';
    },
  },
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
        state.error = action.payload || action.error.message;
      })
      .addCase(joinRoom.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  }
});

export const { clearRoom } = roomSlice.actions;
export default roomSlice.reducer;
