import { Metadata } from "next";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { ContentLayout } from "@/modules/ui/layout/content-layout";
import { ExamResultView } from "@/modules/exam/ui/views/exam-result-view";

export const metadata: Metadata = {
  title: "Exam Result",
  description: "Exam Result",
};

interface Props {
  params: Promise<{ id: string }>;
}

const ExamResult = async ({ params }: Props) => {
  const { id } = await params;

  prefetch(trpc.exam.getForResult.queryOptions(id));

  return (
    <ContentLayout>
      <HydrateClient>
        <ExamResultView id={id} />
      </HydrateClient>
    </ContentLayout>
  );
};

export default ExamResult;
