"use client";

import {
  paginationOptions,
  paginationParser,
} from "@/features/tickets/search-params";
import { useQueryStates } from "nuqs";
import { Button } from "./ui/button";
import { useState, useTransition } from "react";
import { is } from "date-fns/locale";
import { LucideLoader2 } from "lucide-react";

type PaginationProps = {
  paginatedMetadata: {
    count: number;
    hasNextPage: boolean;
  };
};

const Pagination = ({ paginatedMetadata }: PaginationProps) => {
  const { count, hasNextPage } = paginatedMetadata;

  const [isLoading, startTransition] = useTransition();
  const [paginationAction, setPaginationAction] = useState<
    "next" | "prev" | null
  >(null);

  const isNextPageLoading = isLoading && paginationAction === "next";
  const isPrevPageLoading = isLoading && paginationAction === "prev";

  const [pagination, setPagination] = useQueryStates(paginationParser, {
    ...paginationOptions,
    startTransition,
  });

  const startOffset = pagination.page * pagination.size + 1;
  const endOffset = startOffset + pagination.size - 1;
  const actualEndOffset = Math.min(endOffset, count);
  const label = `${startOffset} - ${actualEndOffset} of ${count}`;

  const handleNextPage = () => {
    setPaginationAction("next");
    setPagination({ ...pagination, page: pagination.page + 1 });
  };

  const handlePrevPage = () => {
    setPaginationAction("prev");
    setPagination({ ...pagination, page: Math.max(0, pagination.page - 1) });
  };

  const nextButton = (
    <Button
      variant="outline"
      size="sm"
      onClick={handleNextPage}
      disabled={!hasNextPage || isNextPageLoading}
    >
      {isNextPageLoading && <LucideLoader2 className="animate-spin" />}
      Next
    </Button>
  );
  const prevButton = (
    <Button
      variant="outline"
      size="sm"
      disabled={pagination.page < 1 || isPrevPageLoading}
      onClick={handlePrevPage}
    >
      {isPrevPageLoading && <LucideLoader2 className="animate-spin" />}
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
