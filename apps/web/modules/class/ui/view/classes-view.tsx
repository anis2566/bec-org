"use client";

import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ListCardWrapper } from "@workspace/ui/shared/list-card-wrapper";
import { DesktopPagination } from "@workspace/ui/shared/desktop-pagination";
import { MobilePagination } from "@workspace/ui/shared/mobile-pagination";

import { useGetClasses } from "../../filters/use-get-classes";
import { ClassList } from "../components/class-list";

import { useCreateClass } from "@/hooks/use-class";
import { Filter } from "../components/filter";
import { usePermissions } from "@/hooks/use-user-permission";

export const ClassesView = () => {
  const trpc = useTRPC();
  const [filters, setFilters] = useGetClasses();
  const { onOpen } = useCreateClass();
  const { roles, hasPermission } = usePermissions();

  const { data } = useSuspenseQuery(trpc.class.getAll.queryOptions(filters));

  console.log("Has Permission", hasPermission("class", "read"));

  return (
    <ListCardWrapper
      title="Manage Class"
      value={data?.totalCount}
      actionButtons
      onClickAction={onOpen}
    >
      {hasPermission("class", "read") && <Filter />}
      {/* <Filter />
      <ClassList classes={data?.classes ?? []} /> */}
      <DesktopPagination
        totalCount={data?.totalCount}
        currentPage={filters.page}
        pageSize={filters.limit}
        onPageChange={(page) => setFilters({ page })}
      />
      <MobilePagination
        totalCount={data?.totalCount}
        currentPage={filters.page}
        pageSize={filters.limit}
        onPageChange={(page) => setFilters({ page })}
      />
    </ListCardWrapper>
  );
};
