import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: "",
    profile: "",
    id:""
  },
  reducers: {
    addUser: (state, action) => {
      state.token = action.payload.token;
      state.profile = action.payload.profile;
      state.id=action.payload.id;
    },
    logout: (state) => {
      state.token = "";
      state.profile = "";
      state.id="";
    },
  },
});

export const { addUser, logout } = userSlice.actions;
export default userSlice.reducer;
