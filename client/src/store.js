import { configureStore } from "@reduxjs/toolkit"
import registerReducer from "./Components/StateSlices/registerSlice"
import loginReducer from "./Components/StateSlices/loginSlice"
import newEntryReduser from "./Components/StateSlices/newEntrySlice"
import updateListReduser from "./Components/StateSlices/updateListSlice"

export default configureStore({
    reducer: {
        register: registerReducer,
        login: loginReducer,
        newEntry: newEntryReduser,
        updateList: updateListReduser
    }
})