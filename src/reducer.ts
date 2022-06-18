import { AnyAction } from "redux";
import { initialState, iAppState } from "./state";

export type Reducer<State, Action> = (
  state: State | undefined,
  action: Action
) => State;

export const appReducer: Reducer<iAppState, AnyAction> = function appReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case "CHANGE_MONTH":
      return { ...state, ...action.payload };

    case "LOAD_EVENTS":
      return { ...state, ...action.payload };

    default:
      return initialState;
  }
};
