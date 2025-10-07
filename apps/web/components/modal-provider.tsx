import { CreateAdmissionFeeModal } from "@/modules/admission-fee/ui/modal/create-admission-fee-modal";
import { DeleteAdmisssionFeeModal } from "@/modules/admission-fee/ui/modal/delete-admission-fee-modal";
import { EditAdmissionFeeModal } from "@/modules/admission-fee/ui/modal/edit-admission-fee-modal";
import { AddClassBatchModal } from "@/modules/batch/ui/modal/add-class-batch-modal";
import { AddClassesBatchModal } from "@/modules/batch/ui/modal/add-classes-batch-modal";
import { DeleteBatchClassModal } from "@/modules/batch/ui/modal/delete-batch-class-modal";
import { DeleteBatchModal } from "@/modules/batch/ui/modal/delete-batch-modal";
import { RemoveFromBatchModal } from "@/modules/batch/ui/modal/remove-from-batch-modal";
import { CreateClassModal } from "@/modules/class/ui/modal/create-class-modal";
import { DeleteClassModal } from "@/modules/class/ui/modal/delete-class-modal";
import { EditClassModal } from "@/modules/class/ui/modal/edit-class-modal";
import { CreateCounterModal } from "@/modules/counter/ui/modal/create-counter-modal";
import { DeleteCounterModal } from "@/modules/counter/ui/modal/delete-counter-modal";
import { EditCounterModal } from "@/modules/counter/ui/modal/edit-counter-modal";
import { TransactionModal } from "@/modules/fee/ui/transaction-modal";
import { DeleteHouseModal } from "@/modules/house/ui/modal/delete-house-modal";
import { CreateInstituteModal } from "@/modules/institute/ui/modal/create-institute-modal";
import { DeleteInstituteModal } from "@/modules/institute/ui/modal/delete-institute-modal";
import { EditInstituteModal } from "@/modules/institute/ui/modal/edit-institute-modal";
import { DeleteRoomModal } from "@/modules/room/ui/modal/delete-room-modal";
import { CreateSalaryFeeModal } from "@/modules/salary-fee/ui/modal/create-salary-fee-modal";
import { DeleteSalaryFeeModal } from "@/modules/salary-fee/ui/modal/delete-salary-fee-modal";
import { EditSalaryFeeModal } from "@/modules/salary-fee/ui/modal/edit-salary-fee-modal";
import { CreateSubjectModal } from "@/modules/subject/ui/modal/create-subject-modal";
import { DeleteSubjectModal } from "@/modules/subject/ui/modal/delete-subject-modal";
import { EditSubjectModal } from "@/modules/subject/ui/modal/edit-subject-modal";
import { DeleteTeacherModal } from "@/modules/teacher/ui/modal/delete-teacher-modal";

export const ModalProvider = () => {
  return (
    <>
      <CreateClassModal />
      <EditClassModal />
      <DeleteClassModal />
      <CreateSubjectModal />
      <EditSubjectModal />
      <DeleteSubjectModal />
      <CreateCounterModal />
      <EditCounterModal />
      <DeleteCounterModal />
      <CreateAdmissionFeeModal />
      <EditAdmissionFeeModal />
      <DeleteAdmisssionFeeModal />
      <CreateSalaryFeeModal />
      <EditSalaryFeeModal />
      <DeleteSalaryFeeModal />
      <CreateInstituteModal />
      <EditInstituteModal />
      <DeleteInstituteModal />
      <DeleteTeacherModal />
      <DeleteHouseModal />
      <DeleteRoomModal />
      <DeleteBatchModal />
      <RemoveFromBatchModal />
      <TransactionModal />
      <AddClassBatchModal />
      <AddClassesBatchModal />
      <DeleteBatchClassModal />
    </>
  );
};
