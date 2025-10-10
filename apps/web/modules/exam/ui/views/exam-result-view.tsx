"use client";

import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { UserRoundCheck, UserRoundX, UsersRound } from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import { CardWrapper } from "@workspace/ui/shared/card-wrapper";
import { ListCardWrapper } from "@workspace/ui/shared/list-card-wrapper";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@workspace/ui/components/table";

interface ExamResultProps {
  id: string;
}

export const ExamResultView = ({ id }: ExamResultProps) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.exam.getForResult.queryOptions(id));

  return (
    <div className="space-y-6">
      <CardWrapper contentClassName="space-y-4">
        <div>
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="border-l-4 border-emerald-500 pl-4 py-1">
                <p className="text-md font-semibold mb-1">Name</p>
                <p className="text-sm text-muted-foreground">{data?.name}</p>
              </div>
              <div className="border-l-4 border-emerald-500 pl-4 py-1">
                <p className="text-md font-semibold mb-1">Category</p>
                <p className="text-sm text-muted-foreground">
                  {data?.examCategory?.name}
                </p>
              </div>
              <div className="border-l-4 border-emerald-500 pl-4 py-1">
                <p className="text-md font-semibold mb-1">Subject</p>
                <p className="text-sm text-muted-foreground">
                  {data?.subject?.name}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant="secondary"
            className={`px-3 py-1 font-medium rounded-full`}
          >
            <UsersRound className="w-3 h-3" />
            <span>Total</span>
            <span className="font-bold">{data?.examResults?.length}</span>
          </Badge>
          <Badge
            variant="secondary"
            className={`px-3 py-1 font-medium rounded-full text-green-500`}
          >
            <UserRoundCheck className="w-3 h-3" />
            <span>Attended</span>
            <span className="font-bold">{0}</span>
          </Badge>
          <Badge
            variant="secondary"
            className={`px-3 py-1 font-medium rounded-full text-rose-500`}
          >
            <UserRoundX className="w-3 h-3 " />
            <span>Absent</span>
            <span className="font-bold">{0}</span>
          </Badge>
        </div>
      </CardWrapper>

      
    </div>
  );
};
