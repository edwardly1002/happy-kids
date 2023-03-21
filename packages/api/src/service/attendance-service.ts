import { Kysely, sql } from "kysely";
import { DB } from "kysely-codegen";
import moment from "moment";
import { injectable } from "tsyringe";
import { AttendanceStatus } from "../router/attendance/protocols";
import { z } from "zod";

@injectable()
class AttendanceService {
  constructor(private mysqlDB: Kysely<DB>) {}

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
      .then((resp) => resp.flat());

    return {
      attendances: attendances,
      message: null
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
        "Attendance.checkinPhotoUrl",
        "Attendance.checkoutPhotoUrl",
        "CheckinTeacher.fullname as checkinTeacherFullname",
        "CheckoutTeacher.fullname as checkoutTeacherFullname",
        "Relative.fullname as pickerRelativeFullname"
      ])
      .where("Attendance.id", "=", id)
      .executeTakeFirst();

    if (attendance == null) {
      return {
        attendance: null,
        message: "No record found"
      };
    }

    return {
      attendance: attendance,
      message: null
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
      .then((resp) => resp.flat());

    const statistics = {
      CheckedIn: 0,
      NotCheckedIn: 0,
      AbsenseWithPermission: 0,
      AbsenseWithoutPermission: 0
    };

    records.map((record) => {
      switch (record.status) {
        case "CheckedIn":
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
      }
    });

    return {
      statistics: statistics,
      message: null
    };
  };

  getStudentList = async (classId: string, date: Date) => {
    console.log(
      `getStudentList receive request ${JSON.stringify({
        classId: classId
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
          .select(["studentId", "status", "checkinNote"])
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
        "Attendance.checkinNote"
      ])
      .where("Class.id", "=", classId)
      .execute()
      .then((resp) => {
        const rawStudents = resp.map((item) => {
          if (!item.status) {
            item.status = "NotCheckedIn";
          }
          return item;
        });

        return rawStudents;
      });

    const refinedStudents = rawStudents.map((student) => {
      return {
        id: student.id,
        fullname: student.fullname as string,
        avatarUrl: student.avatarUrl as string,
        className: student.className as string,
        attendanceStatus: student.status as string,
        attendanceCheckinNote: student.checkinNote as string
      };
    });

    return {
      students: refinedStudents,
      message: null
    };
  };

  checkin = async (
    studentId: string,
    status: z.infer<typeof AttendanceStatus>,
    note: string,
    time: Date,
    teacherId: string,
    photoUrl: string
  ) => {
    console.log(
      `checkIn receive request ${JSON.stringify({
        status: status,
        date: time,
        checkInTime: time,
        checkInNote: note,
        studentId: studentId,
        teacherId: teacherId,
        checkInPhotoUrl: photoUrl
      })}`
    );

    const count = await this.mysqlDB
      .insertInto("Attendance")
      .values({
        status: status,
        date: time,
        checkinTime: time,
        checkinNote: note,
        studentId: studentId,
        checkinTeacherId: teacherId,
        checkinPhotoUrl: photoUrl
      })
      .executeTakeFirstOrThrow()
      .then((res) => res.numInsertedOrUpdatedRows);

    if (!count || count <= 0) return { message: "Insertion fail." };

    return {
      message: null
    };
  };

  checkout = async (
    studentId: string,
    note: string,
    time: Date,
    teacherId: string,
    photoUrl: string,
    pickerRelativeId: string
  ) => {
    console.log(
      `checkOut receive request ${JSON.stringify({
        date: time,
        checkoutTime: time,
        checkoutNote: note,
        studentId: studentId,
        teacherId: teacherId,
        checkoutPhotoUrl: photoUrl,
        pickerRelativeId: pickerRelativeId
      })}`
    );

    const startOfDate = moment(moment(time).format("MM/DD/YYYY")).toDate();
    const endOfDate = moment(moment(time).format("MM/DD/YYYY"))
      .add(1, "day")
      .toDate();

    const query = this.mysqlDB
      .updateTable("Attendance")
      .set({
        status: "CheckedOut",
        checkoutTime: time,
        checkoutNote: note,
        checkoutTeacherId: teacherId,
        checkoutPhotoUrl: photoUrl,
        pickerRelativeId: pickerRelativeId != "" ? pickerRelativeId : null
      })
      .where("studentId", "=", studentId)
      .where("date", "<=", endOfDate)
      .where("date", ">=", startOfDate);

    const count = await query
      .executeTakeFirstOrThrow()
      .then((res) => res.numUpdatedRows);

    if (count && count <= 0) return { message: "Update fail." };

    return {
      message: null
    };
  };
}

export default AttendanceService;
