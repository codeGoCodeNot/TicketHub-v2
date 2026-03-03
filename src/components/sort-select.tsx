"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortOptions, sortParser } from "@/features/tickets/search-params";
import { useQueryStates } from "nuqs";

type Option = {
  label: string;
  sortValue: string;
  sortKey: string;
};

type SortSelectProps = {
  options: Option[];
};

const SortSelect = ({ options }: SortSelectProps) => {
  const [sort, setSort] = useQueryStates(sortParser, sortOptions);

  const handleSort = (sortKey: string) => {
    const sortValue = options.find(
      (option) => option.sortKey === sortKey,
    )?.sortValue;

    setSort({
      sortKey,
      sortValue,
    });
  };

  return (
    <Select onValueChange={handleSort} defaultValue={sort.sortKey}>
      <SelectTrigger className="w-full max-w-38">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tickets</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.sortKey} value={option.sortKey}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SortSelect;
