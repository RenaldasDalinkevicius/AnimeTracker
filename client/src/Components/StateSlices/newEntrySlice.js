import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    status: "idle",
    posted: null,
    error: null
}

export const newEntry = createAsyncThunk(
    "new/post",
    async (selectedData, {rejectWithValue}) => {
        try {
            const {userId} = selectedData
            const {returnedData} = await axios.post(
                `/record/newEntry/${userId}`,
                selectedData
            )
            return returnedData
        }
        catch(err) {
            return rejectWithValue(err.response.data)
        }
    }
)

export const newEntrySlice = createSlice({
    name: "newentry",
    initialState,
    reducers: {},
    extraReducers: {
        [newEntry.pending]: (state, action) => {
            state.status = "loading"
        },
        [newEntry.fulfilled]: (state, action) => {
            state.status = "succeded",
            state.posted = true
        },
        [newEntry.rejected]: (state, action) => {
            state.status = "failed",
            state.error = action.payload.message
        }
    }
})
export default newEntrySlice.reducer