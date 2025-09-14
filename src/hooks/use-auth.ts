import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux/store';

export const selectAuth = (state: RootState) => state.auth;

export const useAuth = () => {
  const auth = useSelector(selectAuth)

  return useMemo(() => auth, [auth]);
}
