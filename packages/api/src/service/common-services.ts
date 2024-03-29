import { mysqlDB } from "@acme/db";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import "reflect-metadata";
import { container } from "tsyringe";
import AttendanceService from "./attendance-service";
import LoginService from "./login-service";
import MedicineService from "./medicine-service";
import PickupService from "./pickup-service";
import LeaveLetterService from "./leaveletter-service";
import DailyRemarkService from "./daily-remark-service";
import PeriodRemarkService from "./period-remark-service";
import NoteService from "./note-service";
import { PostService } from "./post-service";
import AccountService from "./account-service";
import NotiService from "./noti-service";
import { PhotoService } from "../utils/PhotoService";
import { FileService } from "../utils/FileService";
import { TimeService } from "../utils/TimeService";
import AlbumService from "./album-service";
import AuthService from "./auth-service";
import { ExpoNotificationWrapper } from "../utils/ExpoNotificationWrapper";

container.register<Kysely<DB>>(Kysely, { useValue: mysqlDB });
container.register("FileService", { useClass: FileService });
container.register("PhotoService", { useClass: PhotoService });
container.register("TimeService", { useClass: TimeService });
container.register("ExpoNotificationWrapper", {
  useClass: ExpoNotificationWrapper
});

export const loginService = container.resolve(LoginService);
export const attendanceService = container.resolve(AttendanceService);
export const pickupService = container.resolve(PickupService);
export const noteService = container.resolve(NoteService);

export const medicineService = container.resolve(MedicineService);

export const leaveletterService = container.resolve(LeaveLetterService);

export const dailyRemarkService = container.resolve(DailyRemarkService);
export const periodRemarkService = container.resolve(PeriodRemarkService);

export const postService = container.resolve(PostService);

export const accountService = container.resolve(AccountService);

export const notiService = container.resolve(NotiService);

export const authService = container.resolve(AuthService);

export const albumService = container.resolve(AlbumService);
