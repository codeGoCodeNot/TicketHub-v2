import React from "react";
import { Separator } from "./ui/separator";

type HeadingProps = {
  title: React.ReactNode;
  description?: string;
  tabs?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
};

const Heading = ({
  title,
  description,
  tabs,
  actions,
  breadcrumbs,
}: HeadingProps) => {
  return (
    <>
      {breadcrumbs && <div className="px-8">{breadcrumbs}</div>}
      {tabs}
      <div className="flex justify-between flex-col lg:flex-row gap-y-4 items-center px-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-gray-500">{description}</p>
        </div>
        <div>{actions}</div>
      </div>
      <Separator />
    </>
  );
};

export default Heading;
