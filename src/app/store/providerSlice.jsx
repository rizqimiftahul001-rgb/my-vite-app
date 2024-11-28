import { createSlice } from "@reduxjs/toolkit";

export const providerSlice = createSlice({
  name: "provider",
  initialState: {
    selectedprovider: 1,
    dynamicImg: null,
  },
  reducers: {
    providerChanged: (state, action) => {
      state.selectedprovider = action.payload;
    },
    setDynamicImg: (state, action) => {
      state.dynamicImg = action.payload;
    },
  },
});

export const { providerChanged,setDynamicImg } = providerSlice.actions;
export default providerSlice.reducer;
