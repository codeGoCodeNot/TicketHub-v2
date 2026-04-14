"use server";
import getAuth from "@/lib/get-auth";

export const getAuthUser = async () => {
  return await getAuth();
};
