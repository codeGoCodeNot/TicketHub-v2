"use client";

import Placeholder from "@/components/placeholder";

type ErrorProps = {
  error: Error;
};

const Error = ({ error }: ErrorProps) => {
  return <Placeholder label={error.message || "Something went wrong"} />;
};

export default Error;
