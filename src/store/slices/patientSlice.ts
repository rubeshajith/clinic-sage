import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PatientState } from "../../types";
import { MOCK_PATIENTS } from "../../utils/mockData";

const initialState: PatientState = {
  patients: MOCK_PATIENTS,
  viewMode: "grid",
  searchQuery: "",
  filterStatus: "All",
  loading: false,
};

const patientSlice = createSlice({
  name: "patients",
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
  patientSlice.actions;
export default patientSlice.reducer;
