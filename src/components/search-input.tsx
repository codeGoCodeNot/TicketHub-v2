"use client";

import { searchParser } from "@/features/tickets/search-params";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./ui/input";
import { useQueryState } from "nuqs";

type SearchInputProps = {
  placeholder: string;
};

const SearchInput = ({ placeholder }: SearchInputProps) => {
  const [search, setSearch] = useQueryState("search", searchParser);

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    },
    150,
  );

  return (
    <Input
      defaultValue={search}
      placeholder={placeholder}
      onChange={handleSearch}
    />
  );
};

export default SearchInput;
