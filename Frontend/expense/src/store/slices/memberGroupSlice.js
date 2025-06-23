import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    members: [],
    isLoading: false,
    error: null,
}

const memberGroupSlice = createSlice({
    name: "memberGroup",
    initialState,
    reducers: {
        getMembersRequest: (state) => {
            state.isLoading = true;
        },
        getMembersSuccess: (state, action) => {
            state.members = action.payload;
            state.isLoading = false;
        },
        getMembersFailure: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        addNewMember: (state, action) => {
            // Thêm member mới vào danh sách
            state.members.push(action.payload);
        },
    }
})


export const { getMembersRequest, getMembersSuccess, getMembersFailure, addNewMember } = memberGroupSlice.actions;
export default memberGroupSlice.reducer;