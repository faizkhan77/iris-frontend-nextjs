import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { api } from './api/api'
import authReducer from "./slices/auth/auth.slice"
import chatReducer from "./slices/chat/chat.slice"  
import StockReducer from "./slices/Company/company.slice"
import PricecharReducer from "./slices/Company/company.slice"


export const store = configureStore({
  reducer: {
    [api.reducerPath] : api.reducer,
    auth : authReducer,
    chat : chatReducer,
    stockSummary : StockReducer,
    priceChart : PricecharReducer
   
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
})




export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch



// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()