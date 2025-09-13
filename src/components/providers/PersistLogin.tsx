import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRefreshMutation } from "@/redux/slices/auth/auth.api";
import { useAppDispatch } from "@/redux/store";
import {setLoading} from "@/redux/slices/auth/auth.slice"

const PersistLogin = ({ children }: { children: React.ReactNode }) => {
  const { token, persist } = useAuth();
  const [refresh, { isLoading }] = useRefreshMutation();

  const dispatch = useAppDispatch()

  useEffect(() => {
  const verifyRefresh = async () => {
    try {
      dispatch(setLoading(true));
      await refresh().unwrap(); // this triggers extraReducer to update token
    } catch (err) {
      console.error("Refresh failed", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!token && persist) {
    verifyRefresh();
  }
}, [token, persist, refresh, dispatch]);

  useEffect(()=>{
    console.log("You Have Token :a",token);
  },[token])

  if (isLoading) {
    return (
      <div className="flex items-center bg-background justify-center h-screen">
        <span className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></span>
      </div>
    );
  }

  return <>{children}</>;
};

export default PersistLogin;
