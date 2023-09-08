import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    status: "Sign up",
    userRegistered: null,
    error: null
}

export const registerUser = createAsyncThunk(
    "register/registerUser",
    async (registrationFormData, {rejectWithValue}) => {
        try {
            const {data} = await axios.post(
                "/record/register",
                registrationFormData
            )
            return data
        } catch(err) {
            return rejectWithValue(err.response.data)
        }
    }
)
export const registerSlice = createSlice({
    name: "register",
    initialState,
    reducer: {},
    extraReducers: {
        [registerUser.pending]: (state, action) => {
            state.status = "loading"
        },
        [registerUser.fulfilled]: (state, action) => {
            state.status = "Sign up"
            state.userRegistered = true
            state.error = null
        },
        [registerUser.rejected]: (state, action) => {
            state.error = action.payload.message
            state.status = "Sign up"
        }
    }
})
export default registerSlice.reducer