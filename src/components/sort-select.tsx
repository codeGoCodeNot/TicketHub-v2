"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortSelectProps = {
  defaltValue: string;
  options: {
    label: string;
    value: string;
  }[];
};

const SortSelect = ({ defaltValue, options }: SortSelectProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === defaltValue) {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <Select
      defaultValue={searchParams.get("sort") || defaltValue}
      onValueChange={handleSearch}
    >
      <SelectTrigger className="w-full max-w-38">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tickets</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SortSelect;
