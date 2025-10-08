import { create } from "zustand";

interface DeleteStudentState {
  isOpen: boolean;
  studentId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteStudent = create<DeleteStudentState>((set) => ({
  isOpen: false,
  studentId: "",
  onOpen: (id: string) => set({ isOpen: true, studentId: id }),
  onClose: () => set({ isOpen: false, studentId: "" }),
}));
