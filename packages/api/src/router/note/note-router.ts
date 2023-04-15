import { noteService } from "../../service/common-services";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import {
  GetNoteThreadListParams,
  GetNoteThreadParams,
  PostNoteMessageParams,
  PostNoteThreadParams,
  UpdateStatusNoteThreadParams
} from "./protocols";

export const noteRouter = createTRPCRouter({
  postNoteThread: protectedProcedure
    .input(PostNoteThreadParams)
    .mutation(async ({ input }) => {
      return await noteService.createNoteThread(
        input.parentId,
        input.studentId,
        input.startDate,
        input.endDate,
        input.content,
        input.photos
      );
    }),
  getNoteThreadList: protectedProcedure
    .input(GetNoteThreadListParams)
    .query(async ({ input }) => {
      return await noteService.getNoteThreadList(
        input.studentId,
        input.classId
      );
    }),
  getNoteThread: protectedProcedure
    .input(GetNoteThreadParams)
    .query(async ({ input }) => {
      return await noteService.getNoteThread(input.noteThreadId);
    }),
  postNoteMessage: protectedProcedure
    .input(PostNoteMessageParams)
    .mutation(async ({ input }) => {
      return await noteService.insertNoteMessage(
        input.noteThreadId,
        input.message
      );
    }),

  updateNoteStatus: protectedProcedure
    .input(UpdateStatusNoteThreadParams)
    .mutation(async ({ input }) => {
      return await noteService.updateNoteStatus(
        input.noteThreadId,
        input.status
      );
    })
});
