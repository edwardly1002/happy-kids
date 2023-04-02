import { leaveletterService } from "../../service/common-services";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import {
  GetLeaveLetterListParams,
  GetLeaveLetterParams,
  PostLeaveLetterParams,
  UpdateStatusLeaveLetterParams
} from "./protocols";

export const leaveletterRouter = createTRPCRouter({
  postLeaveLetter: protectedProcedure
    .input(PostLeaveLetterParams)
    .mutation(async ({ input }) => {
      return await leaveletterService.createLeaveLetter(
        input.parentId,
        input.studentId,
        input.startDate,
        input.endDate,
        input.reason,
        input.photos
      );
    }),

  getLeaveLetterList: protectedProcedure
    .input(GetLeaveLetterListParams)
    .query(async ({ input }) => {
      return await leaveletterService.getLeaveLetterList(
        input.studentId,
        input.classId
      );
    }),

  getLeaveLetter: protectedProcedure
    .input(GetLeaveLetterParams)
    .query(async ({ input }) => {
      return await leaveletterService.getLeaveLetter(input.leaveLetterId);
    }),

  updateMedicineLetter: protectedProcedure
    .input(UpdateStatusLeaveLetterParams)
    .mutation(async ({ input }) => {
      return await leaveletterService.updateLeaveLetter(
        input.teacherId,
        input.leaveLetterId,
        input.status
      );
    })
});