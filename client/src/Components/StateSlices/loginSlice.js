import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { jwtDecode } from "jwt-decode"

const initialState = {
    status: "Login",
    loggedInUser: localStorage.getItem("token")?jwtDecode(localStorage.getItem("token")):null,
    error: null,
    token: null,
}

export const loginUser = createAsyncThunk(
    "login/loginUser",
    async (loginFormData, {rejectWithValue}) => {
        try {
            const {data} = await axios.post("/record/login", loginFormData)
            return data
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
)
export const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        logout(state, action) {
            localStorage.removeItem("token")
            state.loggedInUser = null
        }
    },
    extraReducers: {
        [loginUser.pending]: (state, action) => {
            state.status = "loading"
        },
        [loginUser.fulfilled]: (state, action) => {
            state.status = "Login",
            state.token = action.payload.token,
            state.loggedInUser = jwtDecode(action.payload.token)
            state.error = null
        },
        [loginUser.rejected]: (state, action) => {
            state.error = action.payload.message,
            state.status = "Login"
        }
    }
})
export const {logout} = loginSlice.actions
export default loginSlice.reducer