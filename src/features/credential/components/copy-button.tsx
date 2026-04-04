"use client";

import { Button } from "@/components/ui/button";
import { LucideCheck, LucideCopy } from "lucide-react";
import { useState } from "react";

type CopyButtonProps = {
  value: string;
};

const CopyButton = ({ value }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      size="icon"
      className="h-6 w-6 shrink-0"
    >
      {copied ? (
        <LucideCheck className="w-3 h-3 text-green-500" />
      ) : (
        <LucideCopy className="w-3 h-3" />
      )}
    </Button>
  );
};

export default CopyButton;
