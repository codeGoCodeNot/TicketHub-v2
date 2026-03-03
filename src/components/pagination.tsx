"use client";

import {
  paginationOptions,
  paginationParser,
} from "@/features/tickets/search-params";
import { useQueryStates } from "nuqs";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const Pagination = () => {
  const [pagination, setPagination] = useQueryStates(
    paginationParser,
    paginationOptions,
  );

  const startOffset = pagination.page * pagination.size + 1;
  const endOffset = startOffset + pagination.size - 1;
  const label = `${startOffset} - ${endOffset} of X`;

  const handleNextPage = () => {
    setPagination({ ...pagination, page: pagination.page + 1 });
  };

  const handlePrevPage = () => {
    setPagination({ ...pagination, page: Math.max(0, pagination.page - 1) });
  };

  const nextButton = (
    <Button variant="outline" size="sm" onClick={handleNextPage}>
      Next
    </Button>
  );
  const prevButton = (
    <Button
      variant="outline"
      size="sm"
      disabled={pagination.page < 1}
      onClick={handlePrevPage}
    >
      Previous
    </Button>
  );

  return (
    <div
      className="flex items-center justify-between w-full gap-x-2 text-sm text-muted-foreground 
    border-t pt-4"
    >
      <div>
        <p>{label}</p>
      </div>
      <div className="flex gap-x-2 items-center">
        {prevButton}
        {nextButton}
      </div>
    </div>
  );
};

export default Pagination;
