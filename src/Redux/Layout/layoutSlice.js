import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  collapsed: false,
  showModal: false,
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setCollapsed: (state) => {
      state.collapsed = !state.collapsed;
    },
    setShowModal: (state, { payload }) => {
      state.showModal = payload;
    },
    closeModal: (state) => {
      state.showModal = false;
    },
  
  },
});
const { actions, reducer } = layoutSlice;
export const { setCollapsed, setShowModal, closeModal } = actions;
export default reducer;
