"use server";

import { LoginSchema, LoginSchemaType } from "@/lib/schemas";
import { api } from "@/lib/axios";
import { cookies } from "next/headers";
import axios, { AxiosError } from "axios";

export const createSession = async (token: string) => {
  const store = await cookies();
  store.set({ name: "access_token", value: token, httpOnly: true });
};

export const loginAction = async (values: LoginSchemaType) => {
  const result = LoginSchema.safeParse(values);

  if (!result.success) {
    return {
      status: "error",
      message: result.error.message,
    };
  }

  const { email, password } = result.data;

  try {
    const result = await api.post("/auth/login", {
      email,
      password,
    });

    await createSession(result.data.access_token);
  } catch (error: any) {
    console.log("Login Error", error?.response.data.detail);
    return {
      status: "error",
      message:
        error.response?.data.detail ||
        error?.message ||
        "something Went wrong, try after few minutes",
    };
  }
};

export const isAuthenticated = async () => {
  const store = await cookies();
  return store.has("access_token");
};

export const getUser = async () => {
  const store = await cookies();
  const token = store.get("access_token")?.value;

  if (!token) return null;

  try {
    const res = await api.get("/auth/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data; // ✅ Axios stores response JSON in .data
  } catch (err : any) {
    console.log("Error fetching user:", err?.response.data.detail);
    return null;
  }
};

export const getServerSession = async () => {
  const auth = await isAuthenticated();
  const user = await getUser();

  console.log("processing log");
  

  if (auth && user) {
    return {
      isAuthenticated: auth,
      user,
    };
  }

  return {
    isAuthenticated: false,
    user: null,
  };
};
