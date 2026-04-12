import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const logInRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10m"),
  prefix: "ratelimit:logIn",
});

export const forgotPasswordRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10m"),
  prefix: "ratelimit:forgotPassword",
});

export const redis = Redis.fromEnv();
