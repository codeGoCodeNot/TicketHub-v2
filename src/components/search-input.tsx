"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";

type SearchInputProps = {
  placeholder: string;
};

const SearchInput = ({ placeholder }: SearchInputProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    const params = new URLSearchParams(searchParams);

    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return <Input placeholder={placeholder} onChange={handleSearch} />;
};

export default SearchInput;
