import { LucideLoader } from "lucide-react";

const Spinner = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <LucideLoader className="animate-spin h-10 w-10" />
    </div>
  );
};

export default Spinner;
