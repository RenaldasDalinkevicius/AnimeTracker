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
            const {data} = await axios.post(
                `/record/newEntry/${userId}`,
                {
                    "title": selectedData.title,
                    "imageUrl": selectedData.imageUrl,
                    "episodes": selectedData.episodes
                }
            )
            return data
        }
        catch(err) {
            return rejectWithValue(err.response.data)
        }
    }
)

export const newEntrySlice = createSlice({
    name: "newentry",
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = "idle"
            state.posted = null
            state.error = null
        }
    },
    extraReducers: {
        [newEntry.pending]: (state, action) => {
            state.status = "loading"
        },
        [newEntry.fulfilled]: (state, action) => {
            state.status = "succeded",
            state.posted = action.payload.message
        },
        [newEntry.rejected]: (state, action) => {
            state.status = "failed",
            state.error = action.payload.message
        }
    }
})

export const {resetStatus} = newEntrySlice.actions

export default newEntrySlice.reducer