// feature/doctor/doctorSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DoctorState } from "@/types";
import { MOCK_DOCTORS } from "./doctorData";

const initialState: DoctorState = {
  doctors: MOCK_DOCTORS,
  viewMode: "grid",
  searchQuery: "",
  filterStatus: "All",
  loading: false,
};

const doctorSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    setViewMode(state, action: PayloadAction<"grid" | "list">) {
      state.viewMode = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setFilterStatus(state, action: PayloadAction<string>) {
      state.filterStatus = action.payload;
    },
  },
});

export const { setViewMode, setSearchQuery, setFilterStatus } =
  doctorSlice.actions;
export default doctorSlice.reducer;
