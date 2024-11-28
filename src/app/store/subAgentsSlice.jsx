import { createSlice } from "@reduxjs/toolkit";

export const subAgentsSlice = createSlice({
  name: "subAgents",
  initialState: {
    subAgents: [],
  },
  reducers: {
    subAgentsChanged: (state, action) => {
      state.subAgents = action.payload;
    },
  },
});

export const { subAgentsChanged } = subAgentsSlice.actions;
export default subAgentsSlice.reducer;
