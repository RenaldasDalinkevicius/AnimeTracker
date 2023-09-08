import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    status: "Login",
    loggedInUser: null,
    error: null
}

export const loginUser = createAsyncThunk(
    "login/loginUser",
    async (loginFormData, {rejectWithValue}) => {
        try {
            const {data} = await axios.post("record/login", loginFormData)
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
            state.loggedInUser = null
        }
    },
    extraReducers: {
        [loginUser.pending]: (state, action) => {
            state.status = "loading"
        },
        [loginUser.fulfilled]: (state, action) => {
            state.status = "Login",
            state.loggedInUser = action.payload,
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