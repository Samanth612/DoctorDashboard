import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer";

const rootReducer: any = combineReducers({
  auth: AuthReducer,
});

export default rootReducer;
