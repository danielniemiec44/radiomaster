import {combineReducers} from 'redux';
import {radioMasterReducer} from './RadioMasterReducer';

const rootReducer = combineReducers({
    radioMaster: radioMasterReducer,
});

export type RootReducerTypes = ReturnType<typeof rootReducer>;
export default rootReducer;