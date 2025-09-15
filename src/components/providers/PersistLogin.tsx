import { useEffect, useLayoutEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRefreshMutation } from "@/redux/slices/auth/auth.api";
import { useAppDispatch } from "@/redux/store";
import { setLoading, setToken } from "@/redux/slices/auth/auth.slice";
import DashboardSkeleton from "../global-layout-skeleton";

const PersistLogin = ({ children }: { children: React.ReactNode }) => {
  const { token, persist } = useAuth();
  const [refresh, { isLoading }] = useRefreshMutation();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const verifyRefresh = async () => {
      try {
        dispatch(setLoading(true));
        const res = await refresh().unwrap();
        dispatch(setToken({ token: res.access_token }));
      } catch (err) {
        console.error("Refresh failed", err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (!token && persist) verifyRefresh();
  }, [token, persist, refresh, dispatch]);

  useEffect(() => {
    // console.log("You Have Token :a", token);
  }, [token]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return <>{children}</>;
};

export default PersistLogin;
