import { Separator } from "./ui/separator";

type HeadingProps = {
  title: string;
  description?: string;
};

const Heading = ({ title, description }: HeadingProps) => {
  return (
    <>
      <div className="px-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>

      <Separator />
    </>
  );
};

export default Heading;
