"use client";

import { RefreshCcw, Trash2 } from "lucide-react";
import { format } from "date-fns";

import { Document, PrintTask } from "@workspace/db";
import { ListActions } from "@workspace/ui/shared/list-actions";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@workspace/ui/components/table";

import { ListActionButton } from "@/components/list-action-button";
import { Badge } from "@workspace/ui/components/badge";

import { PRINT_TASK_STATUS } from "@workspace/utils/constant";
import { useDeletePrintTask, useTogglePrintTask } from "@/hooks/use-print-task";

interface DocumentWithRelation extends Document {
  className: {
    name: string;
  };
  subject: {
    name: string;
  };
}

interface PrintTaskWithRelation extends PrintTask {
  document: DocumentWithRelation;
}

interface HomeworkListProps {
  tasks: PrintTaskWithRelation[];
}

export const PrintTaskList = ({ tasks }: HomeworkListProps) => {
  const { onOpen } = useDeletePrintTask();
  const { onOpen: onToggle } = useTogglePrintTask();

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-background/60">
          <TableHead>Type</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>D. Date</TableHead>
          <TableHead>Copies</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.document.type}</TableCell>
            <TableCell>{task.document.name}</TableCell>
            <TableCell>{task.document.subject.name}</TableCell>
            <TableCell>{task.document.className.name}</TableCell>
            <TableCell>
              {format(task.document.deliveryDate, "dd MMM yyyy hh:mm a")}
            </TableCell>
            <TableCell>{task.document.noOfCopy}</TableCell>
            <TableCell>
              <Badge
                variant={
                  task.status === PRINT_TASK_STATUS.Pending
                    ? "secondary"
                    : "default"
                }
                className="rounded-full"
              >
                {task.status}
              </Badge>
            </TableCell>
            <TableCell>
              <ListActions>
                <ListActionButton
                  title="Toggle Status"
                  icon={RefreshCcw}
                  onClick={() => onToggle(task.id, task.status)}
                />
                <ListActionButton
                  isDanger
                  title="Delete"
                  icon={Trash2}
                  onClick={() => onOpen(task.id)}
                />
              </ListActions>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
