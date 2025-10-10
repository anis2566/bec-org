import { create } from "zustand";

interface DeleteExamState {
  isOpen: boolean;
  examId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteExam = create<DeleteExamState>((set) => ({
  isOpen: false,
  examId: "",
  onOpen: (id: string) => set({ isOpen: true, examId: id }),
  onClose: () => set({ isOpen: false, examId: "" }),
}));
