"use client";

import { useState } from "react";
import CopyButton from "./copy-button";
import { Button } from "@/components/ui/button";
import { LucideEye, LucideEyeOff } from "lucide-react";

type SecretDisplayProps = {
  value: string;
};

const SecretDisplay = ({ value }: SecretDisplayProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex items-center gap-x-2">
      <span className="text-xs font-mono truncate max-w-[200px]">
        {visible ? value : "••••••••••••••••••••"}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6 shrink-0"
        onClick={() => setVisible((prev) => !prev)}
      >
        {visible ? (
          <LucideEyeOff className="w-3 h-3" />
        ) : (
          <LucideEye className="w-3 h-3" />
        )}
      </Button>
      <CopyButton value={value} />
    </div>
  );
};

export default SecretDisplay;
