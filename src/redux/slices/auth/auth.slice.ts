import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authapi } from "./auth.api";
import type { LoginResponse } from "./types";
import type { RootState } from "@/redux/store";

// Define Auth state type
interface AuthState {
  isAuthenticated: boolean;
  user: null | {
    id: string;
    email: string;
  };
  token: string | null;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

// Create slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    register: (
      state,
      action: PayloadAction<{
        id: string;
        email: string;
        token: string;
      }>
    ) => {
      state.isAuthenticated = true;
      state.user = {
        id: action.payload.id,
        email: action.payload.email,
      };
      state.token = action.payload.token;
    },
    login: (
      state,
      action: PayloadAction<{
        id: string;
        email: string;
        token: string;
      }>
    ) => {
      state.isAuthenticated = true;
      state.user = {
        id: action.payload.id,
        email: action.payload.email,
      };
      state.token = action.payload.token;
      localStorage.setItem("access_token",action.payload.token)
    },
    setToken : (state,action : PayloadAction<{token : string}>)=>{
      state.token = action.payload.token
      localStorage.setItem("access_token",action.payload.token)
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
  extraReducers : (builder) => {
    builder.addMatcher(authapi.endpoints.login.matchFulfilled,(state,action : PayloadAction<LoginResponse>)=>{
        state.token = action.payload.access_token
    })
  }
});

// Export actions
export const { register, login, logout,setToken } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
export const selectCurrentUser = (state: RootState) => state.auth.user

