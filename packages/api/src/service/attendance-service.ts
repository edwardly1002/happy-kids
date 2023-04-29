import { Kysely, sql } from "kysely";
import { DB } from "kysely-codegen";
import moment from "moment";
import { injectable } from "tsyringe";
import { AttendanceStatus } from "../router/attendance/protocols";
import { z } from "zod";
import { PhotoService } from "../utils/PhotoService";
import { SYSTEM_ERROR_MESSAGE } from "../utils/errorHelper";

@injectable()
class AttendanceService {
  constructor(
    private mysqlDB: Kysely<DB>,
    private photoService: PhotoService
  ) {}

  getAttendanceList = async (
    timeStart: Date,
    timeEnd: Date,
    studentId: string
  ) => {
    console.log(
      `getAttendanceListService receive request ${JSON.stringify({
        timeStart: timeStart,
        timeEnd: timeEnd,
        studentId: studentId
      })}`
    );

    const attendances = await this.mysqlDB
      .selectFrom("Attendance")
      .select([
        "id",
        "date",
        "status",
        "checkinTime",
        "checkoutTime",
        "checkinNote",
        "checkoutNote"
      ])
      .where("date", ">=", timeStart)
      .where("date", "<=", timeEnd)
      .where("studentId", "=", studentId)
      .execute()
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    return {
      attendances: attendances
    };
  };

  getAttendanceItemDetail = async (id: string) => {
    console.log(
      `getAttendanceItemDetail receive request ${JSON.stringify({
        id: id
      })}`
    );

    const attendance = await this.mysqlDB
      .selectFrom("Attendance")
      .leftJoin(
        "User as CheckinTeacher",
        "Attendance.checkinTeacherId",
        "CheckinTeacher.id"
      )
      .leftJoin(
        "User as CheckoutTeacher",
        "Attendance.checkoutTeacherId",
        "CheckoutTeacher.id"
      )
      .leftJoin(
        "User as Relative",
        "Attendance.pickerRelativeId",
        "Relative.id"
      )
      .select([
        "Attendance.id",
        "Attendance.date",
        "Attendance.status",
        "Attendance.checkinTime",
        "Attendance.checkoutTime",
        "Attendance.checkinNote",
        "Attendance.checkoutNote",
        "Attendance.checkinPhotos",
        "Attendance.checkoutPhotos",
        "CheckinTeacher.fullname as checkinTeacherFullname",
        "CheckoutTeacher.fullname as checkoutTeacherFullname",
        "Relative.fullname as pickerRelativeFullname"
      ])
      .where("Attendance.id", "=", id)
      .executeTakeFirstOrThrow()
      .then(async (resp) => {
        const checkinPhotoPaths = resp.checkinPhotos
          ? <string[]>JSON.parse(resp.checkinPhotos)
          : [];
        const checkoutPhotoPaths = resp.checkoutPhotos
          ? <string[]>JSON.parse(resp.checkoutPhotos)
          : [];

        const checkinPhotos = await Promise.all(
          checkinPhotoPaths.map((photoPath) =>
            this.photoService.getPhotoFromPath(photoPath)
          )
        );
        const checkoutPhotos = await Promise.all(
          checkoutPhotoPaths.map((photoPath) =>
            this.photoService.getPhotoFromPath(photoPath)
          )
        );

        return {
          ...resp,
          checkinPhotos: checkinPhotos,
          checkoutPhotos: checkoutPhotos
        };
      })
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    return {
      attendance: attendance
    };
  };

  getAttendanceStatistics = async (
    timeStart: Date,
    timeEnd: Date,
    studentId: string
  ) => {
    console.log(
      `getAttendanceStatistics receive request ${JSON.stringify({
        timeStart: timeStart,
        timeEnd: timeEnd,
        studentId: studentId
      })}`
    );

    const records = await this.mysqlDB
      .selectFrom("Attendance")
      .select(["status", sql<number>`count(status)`.as("count")])
      .groupBy("status")
      .where("date", ">=", timeStart)
      .where("date", "<=", timeEnd)
      .where("studentId", "=", studentId)
      .execute()
      .then((resp) => resp.flat())
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    const statistics = {
      CheckedIn: 0,
      NotCheckedIn: 0,
      AbsenseWithPermission: 0,
      AbsenseWithoutPermission: 0
    };

    records.map((record) => {
      switch (record.status) {
        case "CheckedIn":
        case "CheckedOut":
          statistics.CheckedIn = record.count;
          break;
        case "NotCheckedIn":
          statistics.NotCheckedIn = record.count;
          break;
        case "AbsenseWithPermission":
          statistics.AbsenseWithPermission = record.count;
          break;
        case "AbsenseWithoutPermission":
          statistics.AbsenseWithoutPermission = record.count;
          break;
        default:
          console.log("The attendance status is not handled");
          throw SYSTEM_ERROR_MESSAGE;
      }
    });

    return {
      statistics: statistics
    };
  };

  getStudentList = async (classId: string, date: Date) => {
    console.log(
      `getStudentList receive request ${JSON.stringify({
        classId: classId,
        date: date
      })}`
    );

    const startOfDate = moment(moment(date).format("MM/DD/YYYY")).toDate();
    const endOfDate = moment(moment(date).format("MM/DD/YYYY"))
      .add(1, "day")
      .toDate();

    const rawStudents = await this.mysqlDB
      .selectFrom("Student")
      .innerJoin(
        "StudentClassRelationship",
        "Student.id",
        "StudentClassRelationship.studentId"
      )
      .innerJoin("Class", "Class.id", "StudentClassRelationship.classId")
      .leftJoin(
        this.mysqlDB
          .selectFrom("Attendance")
          .selectAll()
          .where("date", "<=", endOfDate)
          .where("date", ">=", startOfDate)
          .as("Attendance"),
        "Attendance.studentId",
        "Student.id"
      )
      .select([
        "Student.id",
        "Student.fullname",
        "Student.avatarUrl",
        "Class.name as className",
        "Attendance.status",
        "Attendance.checkinNote",
        "Attendance.checkoutNote",
        "Attendance.checkinPhotos",
        "Attendance.checkoutPhotos"
      ])
      .where("Class.id", "=", classId)
      .execute()
      .then((resp) =>
        resp.map((item) => {
          if (!item.status) {
            item.status = "NotCheckedIn";
          }
          return item;
        })
      )
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    const refinedStudents = await Promise.all(
      rawStudents.map(async (student) => {
        const checkinPhotoPaths = student.checkinPhotos
          ? <string[]>JSON.parse(student.checkinPhotos)
          : [];
        const checkoutPhotoPaths = student.checkoutPhotos
          ? <string[]>JSON.parse(student.checkoutPhotos)
          : [];

        const checkinPhotos = await Promise.all(
          checkinPhotoPaths.map((photoPath) =>
            this.photoService.getPhotoFromPath(photoPath)
          )
        );
        const checkoutPhotos = await Promise.all(
          checkoutPhotoPaths.map((photoPath) =>
            this.photoService.getPhotoFromPath(photoPath)
          )
        );

        return {
          id: student.id,
          fullname: student.fullname as string,
          avatar: await this.photoService.getPhotoFromPath(
            student.avatarUrl ?? ""
          ),
          className: student.className as string,
          attendanceStatus: student.status as z.infer<typeof AttendanceStatus>,
          attendanceCheckinNote: student.checkinNote as string,
          attendanceCheckoutNote: student.checkoutNote as string,
          checkinPhotos: checkinPhotos,
          checkoutPhotos: checkoutPhotos
        };
      })
    );

    return {
      students: refinedStudents
    };
  };

  checkin = async (
    studentId: string,
    status: z.infer<typeof AttendanceStatus>,
    note: string,
    teacherId: string,
    photos: string[]
  ) => {
    console.log(
      `checkIn receive request ${JSON.stringify({
        status: status,
        checkInNote: note,
        studentId: studentId,
        teacherId: teacherId,
        checkInPhotos: photos
      })}`
    );

    if (studentId === "") throw SYSTEM_ERROR_MESSAGE;
    if (note === "") throw "Vui lòng thêm ghi chú";
    if (status == "NotCheckedIn") throw "Vui lòng chọn tình trạng điểm danh";
    if (status == "CheckedIn" && photos.length == 0)
      throw "Vui lòng tải lên hình ảnh điểm danh của bé";

    await this.mysqlDB
      .insertInto("Attendance")
      .values({
        status: status,
        date: moment().toDate(),
        checkinNote: note,
        studentId: studentId,
        checkinTeacherId: teacherId,
        checkinPhotos: JSON.stringify(
          photos.map((photo) => {
            return this.photoService.storePhoto(photo, "./attendance");
          })
        )
      })
      .executeTakeFirstOrThrow()
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    return {};
  };

  checkout = async (
    studentId: string,
    note: string,
    time: Date,
    teacherId: string,
    photos: string[],
    pickerRelativeId: string
  ) => {
    console.log(
      `checkOut receive request ${JSON.stringify({
        date: time,
        checkoutNote: note,
        studentId: studentId,
        teacherId: teacherId,
        checkoutPhotos: photos,
        pickerRelativeId: pickerRelativeId
      })}`
    );

    if (studentId === "") throw SYSTEM_ERROR_MESSAGE;
    if (note === "") throw "Vui lòng thêm ghi chú";
    if (photos.length == 0) throw "Vui lòng tải lên hình ảnh điểm danh của bé";

    const startOfDate = moment(moment(time).format("MM/DD/YYYY")).toDate();
    const endOfDate = moment(moment(time).format("MM/DD/YYYY"))
      .add(1, "day")
      .toDate();

    await this.mysqlDB
      .updateTable("Attendance")
      .set({
        status: "CheckedOut",
        checkoutTime: moment().toDate(),
        checkoutNote: note,
        checkoutTeacherId: teacherId,
        checkoutPhotos: JSON.stringify(
          photos.map((photo) => {
            return this.photoService.storePhoto(photo, "./attendance");
          })
        ),
        pickerRelativeId: pickerRelativeId != "" ? pickerRelativeId : null
      })
      .where("studentId", "=", studentId)
      .where("date", "<=", endOfDate)
      .where("date", ">=", startOfDate)
      .executeTakeFirstOrThrow()
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    return {};
  };
}

export default AttendanceService;
