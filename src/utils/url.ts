export const getBaseUrl = () => {
  const environment = process.env.NODE_ENV;

  const baseUrl =
    environment === "development"
      ? "http://localhost:3000"
      : "https://tickethubv2.johnsenb.dev";

  return baseUrl;
};
