import { createSlice } from "@reduxjs/toolkit";

export const headerLoadSlice = createSlice({
  name: "headerLoad",
  initialState: {
    headerLoad: false,
  },
  reducers: {
    headerLoadChanged: (state, action) => {
      state.headerLoad = action.payload;
    },
  },
});

export const { headerLoadChanged } = headerLoadSlice.actions;
export default headerLoadSlice.reducer;
