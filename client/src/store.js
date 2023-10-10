import { configureStore } from "@reduxjs/toolkit"
import registerReducer from "./Components/StateSlices/registerSlice"
import loginReducer from "./Components/StateSlices/loginSlice"
import newEntryReduser from "./Components/StateSlices/newEntrySlice"

const loggedInUserFromStorage = localStorage.getItem("loggedInUser")?JSON.parse(localStorage.getItem("loggedInUser")):null

const preloadedState = {
    login: {
        loggedInUser: loggedInUserFromStorage,
        status: "Login",
        error: null
    }
}

export default configureStore({
    reducer: {
        register: registerReducer,
        login: loginReducer,
        newEntry: newEntryReduser
    },
    preloadedState,
})