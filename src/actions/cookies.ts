"use server";

import { cookies } from "next/headers";

export const getCookieByKey = async (key: string) => {
  const cookie = (await cookies()).get(key);

  return cookie?.value ?? null;
};

export const deleteCookieByKey = async (key: string) => {
  (await cookies()).delete(key);
};

export const setCookieByKey = async (key: string, value: string) => {
  (await cookies()).set(key, value);
};
