export const initialData = {
  tickets: [
    {
      id: "1",
      title: "Issue with login",
      description: "Unable to login with correct credentials.",
      status: "OPEN" as const,
    },
    {
      id: "2",
      title: "Page not loading",
      description: "The dashboard page is not loading for some users.",
      status: "DONE" as const,
    },

    {
      id: "3",
      title: "Missing user permissions",
      description: "Some users are unable to access certain features.",
      status: "IN_PROGRESS" as const,
    },
  ],
};
