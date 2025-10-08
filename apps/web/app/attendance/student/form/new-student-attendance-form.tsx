"use client";

import { useTRPC } from "@/trpc/react";
import { useQueries } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { FormCardWrapper } from "@workspace/ui/shared/form-card-wrapper";
import { ListCardWrapper } from "@workspace/ui/shared/list-card-wrapper";
import { useState } from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Button } from "@workspace/ui/components/button";

type AttendanceRecord = {
  studentId: string;
  status: "present" | "absent";
};

export const NewStudentAttendanceForm = () => {
  const [classNameId, setClassNameId] = useState<string>("");
  const [batchId, setBatchId] = useState<string>("");
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);

  const trpc = useTRPC();

  const [classesQuery, batchesQuery, studentsQuery] = useQueries({
    queries: [
      trpc.class.forSelect.queryOptions({ search: "" }),
      trpc.batch.getByClass.queryOptions(classNameId),
      trpc.student.getByBatch.queryOptions(batchId),
    ],
  });

  const classes = classesQuery.data;
  const batches = batchesQuery.data;
  const students = studentsQuery.data;
  const isLoadingStudents = studentsQuery.isLoading;

  const presentCount = attendances.filter((a) => a.status === "present").length;

  const allPresent =
    students && students.length > 0 && presentCount === students.length;

  const somePresent =
    presentCount > 0 && presentCount < (students?.length || 0);

  const isStudentPresent = (studentId: string) => {
    return attendances.some(
      (a) => a.studentId === studentId && a.status === "present"
    );
  };

  const toggleStudent = (studentId: string) => {
    setAttendances((prev) => {
      const existing = prev.find((a) => a.studentId === studentId);

      if (existing) {
        if (existing.status === "present") {
          return prev.filter((a) => a.studentId !== studentId);
        }
        return prev.map((a) =>
          a.studentId === studentId ? { ...a, status: "present" } : a
        );
      } else {
        return [...prev, { studentId, status: "present" }];
      }
    });
  };

  const toggleAll = () => {
    if (allPresent) {
      setAttendances([]);
    } else {
      const allPresent: AttendanceRecord[] =
        students?.map((s) => ({
          studentId: s.id,
          status: "present" as const,
        })) || [];
      setAttendances(allPresent);
    }
  };

  const markAllPresent = () => {
    const allPresent: AttendanceRecord[] =
      students?.map((s) => ({
        studentId: s.id,
        status: "present" as const,
      })) || [];
    setAttendances(allPresent);
  };

  const markAllAbsent = () => {
    setAttendances([]);
  };

  const handleClassChange = (value: string) => {
    setClassNameId(value);
    setBatchId("");
    setAttendances([]);
  };

  const handleBatchChange = (value: string) => {
    setBatchId(value);
    setAttendances([]);
  };

  const handleSubmit = () => {
    if (!batchId) return;

    const fullAttendances: AttendanceRecord[] =
      students?.map((student) => ({
        studentId: student.id,
        status: isStudentPresent(student.id) ? "present" : "absent",
      })) || [];
  };

  return (
    <div className="space-y-6">
      <FormCardWrapper
        title="New Attendance"
        description="Find batch to create attendance"
      >
        <Select onValueChange={handleClassChange} value={classNameId}>
          <SelectTrigger className="w-full rounded-xs shadow-none dark:bg-background dark:hover:bg-background mb-4">
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            {classes?.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={handleBatchChange} value={batchId}>
          <SelectTrigger className="w-full rounded-xs shadow-none dark:bg-background dark:hover:bg-background">
            <SelectValue placeholder="Select batch" />
          </SelectTrigger>
          <SelectContent>
            {batches?.map((batch) => (
              <SelectItem key={batch.id} value={batch.id}>
                {batch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormCardWrapper>

      {students && students.length > 0 && (
        <>
          <div>
            <div className="flex items-center gap-4">
              <Button size="sm" variant="outline" onClick={markAllPresent}>
                Mark All Present
              </Button>
              <Button size="sm" variant="outline" onClick={markAllAbsent}>
                Mark All Absent
              </Button>
              {presentCount > 0 && (
                <Button
                  size="sm"
                  className="rounded-full"
                  variant="destructive"
                  onClick={() => setAttendances([])}
                >
                  Clear
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {presentCount} of {students.length} present
            </p>
          </div>

          <ListCardWrapper title="Students" value={students?.length}>
            <Table>
              <TableHeader>
                <TableRow className="bg-background/60">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allPresent}
                      onCheckedChange={toggleAll}
                      aria-label="Select all students"
                      className={somePresent ? "opacity-50" : ""}
                    />
                  </TableHead>
                  <TableHead>#ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students?.map((student) => {
                  const isPresent = isStudentPresent(student.id);
                  return (
                    <TableRow
                      key={student.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleStudent(student.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isPresent}
                          onCheckedChange={() => toggleStudent(student.id)}
                          aria-label={`Mark ${student.name} as present`}
                        />
                      </TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.mPhone}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student?.salaryPayments?.length > 0
                              ? "destructive"
                              : "default"
                          }
                          className="rounded-full"
                        >
                          {student?.salaryPayments?.length}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ListCardWrapper>

          <Button onClick={handleSubmit} disabled={!batchId} className="w-full">
            Submit Attendance
          </Button>
        </>
      )}
    </div>
  );
};
