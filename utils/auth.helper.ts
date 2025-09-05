import { api } from "@/lib/axios";
import { cookies } from "next/headers";

export const createSession = async (token: string) => {
  const store = await cookies();
  store.set({ name: "access_token", value: token, httpOnly: true });
};

export const getServerSession = async () => {
  const store = await cookies();
  return store.get("access_token");
};


export const refresh = async () => {
  try {
    // if access token not availabe get new token
    const res = await api.get("/auth/refresh");
    createSession(res.data.access_token);
  } catch (error) {
    console.log(error)
  }
};
