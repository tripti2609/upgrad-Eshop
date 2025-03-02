import {createStore, applyMiddleware} from "redux";
import rootReducer from "./reducers";
import { thunk } from 'redux-thunk'; // ✅ Correct import

export default createStore(rootReducer, applyMiddleware(thunk));