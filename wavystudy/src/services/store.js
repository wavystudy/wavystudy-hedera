import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const hashconnectSlice = createSlice({
  name: "hashconnectSlice",
  initialState: {
    isConnected: false,
    accountIds: [],
    pairingString: "",
  },
  reducers: {
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setAccountIds: (state, action) => {
      state.accountIds = action.payload;
    },
    setPairingString: (state, action) => {
      state.pairingString = action.payload;
    },
  },
});

// config the store
export const store = configureStore({
  reducer: {
    hashconnect: hashconnectSlice.reducer,
  },
});

export const actions = {
  hashconnect: hashconnectSlice.actions,
};
