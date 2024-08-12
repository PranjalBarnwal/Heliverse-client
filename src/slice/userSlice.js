import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: "",
    profile: "",
  },
  reducers: {
    addUser: (state, action) => {
      state.token = action.payload.token;
      state.profile = action.payload.profile;
    },
  },
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;