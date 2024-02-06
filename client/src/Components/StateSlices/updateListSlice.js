import {createSlice} from "@reduxjs/toolkit"

export const updateListSlice = createSlice({
    name: "update",
    initialState: {
        bool: false
    },
    reducers: {
        updateListTrue: (state) => {
            state.bool = true
        },
        updateListFalse: (state) => {
            state.bool = false
        }
    }
})

export const {updateListTrue, updateListFalse} = updateListSlice.actions

export default updateListSlice.reducer