import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    status: "Login",
    id: null,
    email: null,
    error: null,
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
export const getMe = createAsyncThunk(
    "login/me",
    async () => {
        try {
            const res = await axios.get("/record/me")
            return res.data.id
        } catch (err) {
            return null
        }
    }
)
export const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        logout(state, action) {
            state.id = null
            state.email = null
            axios.get("/record/logout")
        }
    },
    extraReducers: {
        [getMe.fulfilled]: (state, action) => {
            state.id = action.payload
        },
        [loginUser.pending]: (state, action) => {
            state.status = "loading"
        },
        [loginUser.fulfilled]: (state, action) => {
            state.status = "Login",
            state.id = action.payload.id
            state.error = null
        },
        [loginUser.rejected]: (state, action) => {
            state.error = action.payload.message,
            state.status = "Login"
        }
    }
})
export const {logout, login} = loginSlice.actions
export default loginSlice.reducer