import { configureStore } from "@reduxjs/toolkit";
import { appReducer } from "./reducer";
import { initialState } from "./state";

export const store = configureStore({
  reducer: appReducer,
  preloadedState: initialState,
});
