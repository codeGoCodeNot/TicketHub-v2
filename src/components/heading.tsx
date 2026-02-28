import React from "react";
import { Separator } from "./ui/separator";

type HeadingProps = {
  title: string;
  description?: string;
  tabs?: React.ReactNode;
};

const Heading = ({ title, description, tabs }: HeadingProps) => {
  return (
    <>
      {tabs}
      <div className="px-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-gray-500">{description}</p>
      </div>

      <Separator />
    </>
  );
};

export default Heading;
