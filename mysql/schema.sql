DROP SCHEMA IF EXISTS `KindergartenSchema`;

START TRANSACTION;
CREATE SCHEMA `KindergartenSchema`;

CREATE TABLE `KindergartenSchema`.`School` (
  `id` varchar(36) PRIMARY KEY NOT NULL DEFAULT (UUID()),
  `name` varchar(255) NOT NULL,
  `address` varchar(255),
  `createdAt` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `schoolTermId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`SchoolTerm` (
  `id` varchar(36) PRIMARY KEY NOT NULL DEFAULT (UUID()),
  `year` int NOT NULL,
  `term` int NOT NULL
);

CREATE TABLE `KindergartenSchema`.`Class` (
  `id` varchar(36) PRIMARY KEY NOT NULL DEFAULT (UUID()),
  `name` varchar(255) NOT NULL,
  `schoolYear` int NOT NULL,
  `schoolId` varchar(36) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `KindergartenSchema`.`StudentClassRelationship` (
  `studentId` varchar(36) NOT NULL,
  `classId` varchar(36) NOT NULL
);

CREATE TABLE `KindergartenSchema`.`User` (
  `id` varchar(36) PRIMARY KEY NOT NULL,
  `username` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `birthdate` datetime,
  `email` varchar(255) UNIQUE NOT NULL,
  `phone` varchar(16),
  `avatarUrl` text,
  `schoolId` varchar(36),
  `employeeRole` ENUM ('Manager', 'Teacher'),
  `userGroup` ENUM ('Admin', 'Employee', 'Parent') NOT NULL
);

CREATE TABLE `KindergartenSchema`.`TeacherClassRelationship` (
  `teacherId` varchar(36) NOT NULL,
  `classId` varchar(36) NOT NULL,
  PRIMARY KEY (`teacherId`, `classId`)
);

CREATE TABLE `KindergartenSchema`.`Relative` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `fullname` varchar(255) NOT NULL,
  `phone` varchar(16) UNIQUE NOT NULL,
  `avatarUrl` text,
  `note` varchar(255),
  `parentId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Student` (
  `id` varchar(36) PRIMARY KEY NOT NULL DEFAULT (UUID()),
  `fullname` varchar(255) NOT NULL,
  `avatarUrl` varchar(255),
  `birthdate` datetime NOT NULL,
  `height` decimal(4,1),
  `weight` decimal(3,1),
  `parentId` varchar(36) NOT NULL
);

CREATE TABLE `KindergartenSchema`.`Post` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `createdAt` datetime,
  `content` text,
  `photos` text,
  `userId` varchar(36),
  `schoolTermId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`PostComment` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `content` varchar(255),
  `time` datetime,
  `userId` varchar(36),
  `postId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`PostReaction` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `time` datetime,
  `reaction` varchar(64),
  `userId` varchar(36),
  `postId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`UserCanViewPost` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `userId` varchar(36),
  `postId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`LeaveLetter` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `createdAt` datetime,
  `status` ENUM ('NotConfirmed', 'Confirmed', 'Rejected'),
  `startDate` date,
  `endDate` date,
  `reason` text,
  `updatedByTeacherId` varchar(36),
  `createdByParentId` varchar(36),
  `studentId` varchar(36),
  `schoolTermId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`LeaveLetterPhoto` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `photo` text,
  `leaveLetterId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`MedicineLetter` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `createdAt` datetime,
  `status` ENUM ('NotConfirmed', 'Confirmed', 'Rejected'),
  `note` text,
  `startDate` date,
  `endDate` date,
  `updatedByTeacherId` varchar(36),
  `createdByParentId` varchar(36),
  `studentId` varchar(36),
  `schoolTermId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Medicine` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `name` varchar(255),
  `photo` text,
  `amount` varchar(255),
  `time` int,
  `medicineLetterId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`MedicineLetterUseDiary` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `status` ENUM ('NotUsed', 'Used'),
  `date` date,
  `note` text,
  `medicineLetterId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`PickupLetter` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `note` varchar(255),
  `pickupTime` datetime,
  `createdAt` datetime,
  `status` ENUM ('NotConfirmed', 'Confirmed', 'Rejected'),
  `pickerRelativeId` varchar(36),
  `updatedByTeacherId` varchar(36),
  `studentId` varchar(36),
  `schoolTermId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`NoteThread` (
  `id` varchar(36) PRIMARY KEY,
  `createdAt` datetime,
  `status` ENUM ('NotConfirmed', 'Confirmed', 'Rejected'),
  `photos` text,
  `content` text,
  `startDate` date,
  `endDate` date,
  `createdByParentId` varchar(36),
  `studentId` varchar(36),
  `schoolTermId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`NoteMessage` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `createdAt` datetime,
  `content` text,
  `userId` varchar(36),
  `noteThreadId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Attendance` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `date` datetime,
  `checkinTime` datetime,
  `checkoutTime` datetime,
  `checkinNote` varchar(255),
  `checkoutNote` varchar(255),
  `checkinPhotos` varchar(255),
  `checkoutPhotos` varchar(255),
  `thermo` decimal(4,2),
  `status` ENUM ('CheckedOut', 'CheckedIn', 'NotCheckedIn', 'AbsenseWithPermission', 'AbsenseWithoutPermission'),
  `studentId` varchar(36),
  `checkinTeacherId` varchar(36),
  `checkoutTeacherId` varchar(36),
  `pickerRelativeId` varchar(36),
  `schoolTermId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Timetable` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `startDate` datetime,
  `weekNumber` int,
  `fileUrl` varchar(255),
  `classId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Lecture` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `startTime` datetime,
  `endTime` datetime,
  `name` varchar(255),
  `timetableId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Menu` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `date` datetime
);

CREATE TABLE `KindergartenSchema`.`MenuClassRelationship` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `menuId` varchar(36),
  `classId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Meal` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `time` datetime,
  `menuId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Dish` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `name` varchar(255),
  `mealId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`DailyRemark` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `date` datetime,
  `teacherId` varchar(36),
  `studentId` varchar(36),
  `schoolTermId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`DailyRemarkActivity` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `activity` ENUM ('Study', 'Eat', 'Sleep', 'Wc', 'Other'),
  `content` text,
  `dailyRemarkId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`PeriodRemark` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `period` ENUM ('Week', 'Month', 'Quarter', 'Year'),
  `content` text,
  `startTime` datetime,
  `endTime` datetime,
  `teacherId` varchar(36),
  `studentId` varchar(36),
  `schoolTermId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`TuitionFee` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `status` ENUM ('Paid', 'Unpaid'),
  `startTime` datetime,
  `endTime` datetime,
  `billUrl` varchar(255),
  `amount` bigint,
  `studentId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Album` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `title` varchar(255),
  `description` text,
  `photos` text,
  `createdAt` datetime,
  `eventDate` datetime,
  `teacherId` varchar(36),
  `classId` varchar(36),
  `schoolTermId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`AlbumTopic` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `topic` text
);

CREATE TABLE `KindergartenSchema`.`AlbumTopicRelationship` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `albumId` varchar(36),
  `topicId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`Noti` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `title` text,
  `content` text,
  `route` text,
  `photoUrl` text,
  `time` datetime,
  `userId` varchar(36),
  `classId` varchar(36),
  `createUserId` varchar(36)
);

CREATE TABLE `KindergartenSchema`.`UserNotification` (
  `id` varchar(36) PRIMARY KEY DEFAULT (UUID()),
  `token` text,
  `disabledTopics` text,
  `userId` varchar(36)
);

ALTER TABLE `KindergartenSchema`.`School` ADD FOREIGN KEY (`schoolTermId`) REFERENCES `KindergartenSchema`.`SchoolTerm` (`id`);

ALTER TABLE `KindergartenSchema`.`Class` ADD FOREIGN KEY (`schoolId`) REFERENCES `KindergartenSchema`.`School` (`id`);

ALTER TABLE `KindergartenSchema`.`StudentClassRelationship` ADD FOREIGN KEY (`studentId`) REFERENCES `KindergartenSchema`.`Student` (`id`);

ALTER TABLE `KindergartenSchema`.`StudentClassRelationship` ADD FOREIGN KEY (`classId`) REFERENCES `KindergartenSchema`.`Class` (`id`);

ALTER TABLE `KindergartenSchema`.`User` ADD FOREIGN KEY (`schoolId`) REFERENCES `KindergartenSchema`.`School` (`id`);

ALTER TABLE `KindergartenSchema`.`TeacherClassRelationship` ADD FOREIGN KEY (`teacherId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`TeacherClassRelationship` ADD FOREIGN KEY (`classId`) REFERENCES `KindergartenSchema`.`Class` (`id`);

ALTER TABLE `KindergartenSchema`.`Relative` ADD FOREIGN KEY (`parentId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`Student` ADD FOREIGN KEY (`parentId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`Post` ADD FOREIGN KEY (`userId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`Post` ADD FOREIGN KEY (`schoolTermId`) REFERENCES `KindergartenSchema`.`SchoolTerm` (`id`);

ALTER TABLE `KindergartenSchema`.`PostComment` ADD FOREIGN KEY (`userId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`PostComment` ADD FOREIGN KEY (`postId`) REFERENCES `KindergartenSchema`.`Post` (`id`);

ALTER TABLE `KindergartenSchema`.`PostReaction` ADD FOREIGN KEY (`userId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`PostReaction` ADD FOREIGN KEY (`postId`) REFERENCES `KindergartenSchema`.`Post` (`id`);

ALTER TABLE `KindergartenSchema`.`UserCanViewPost` ADD FOREIGN KEY (`userId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`UserCanViewPost` ADD FOREIGN KEY (`postId`) REFERENCES `KindergartenSchema`.`Post` (`id`);

ALTER TABLE `KindergartenSchema`.`LeaveLetter` ADD FOREIGN KEY (`updatedByTeacherId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`LeaveLetter` ADD FOREIGN KEY (`createdByParentId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`LeaveLetter` ADD FOREIGN KEY (`studentId`) REFERENCES `KindergartenSchema`.`Student` (`id`);

ALTER TABLE `KindergartenSchema`.`LeaveLetter` ADD FOREIGN KEY (`schoolTermId`) REFERENCES `KindergartenSchema`.`SchoolTerm` (`id`);

ALTER TABLE `KindergartenSchema`.`LeaveLetterPhoto` ADD FOREIGN KEY (`leaveLetterId`) REFERENCES `KindergartenSchema`.`LeaveLetter` (`id`);

ALTER TABLE `KindergartenSchema`.`MedicineLetter` ADD FOREIGN KEY (`updatedByTeacherId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`MedicineLetter` ADD FOREIGN KEY (`createdByParentId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`MedicineLetter` ADD FOREIGN KEY (`studentId`) REFERENCES `KindergartenSchema`.`Student` (`id`);

ALTER TABLE `KindergartenSchema`.`MedicineLetter` ADD FOREIGN KEY (`schoolTermId`) REFERENCES `KindergartenSchema`.`SchoolTerm` (`id`);

ALTER TABLE `KindergartenSchema`.`Medicine` ADD FOREIGN KEY (`medicineLetterId`) REFERENCES `KindergartenSchema`.`MedicineLetter` (`id`);

ALTER TABLE `KindergartenSchema`.`MedicineLetterUseDiary` ADD FOREIGN KEY (`medicineLetterId`) REFERENCES `KindergartenSchema`.`MedicineLetter` (`id`);

ALTER TABLE `KindergartenSchema`.`PickupLetter` ADD FOREIGN KEY (`pickerRelativeId`) REFERENCES `KindergartenSchema`.`Relative` (`id`);

ALTER TABLE `KindergartenSchema`.`PickupLetter` ADD FOREIGN KEY (`updatedByTeacherId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`PickupLetter` ADD FOREIGN KEY (`studentId`) REFERENCES `KindergartenSchema`.`Student` (`id`);

ALTER TABLE `KindergartenSchema`.`PickupLetter` ADD FOREIGN KEY (`schoolTermId`) REFERENCES `KindergartenSchema`.`SchoolTerm` (`id`);

ALTER TABLE `KindergartenSchema`.`NoteThread` ADD FOREIGN KEY (`createdByParentId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`NoteThread` ADD FOREIGN KEY (`studentId`) REFERENCES `KindergartenSchema`.`Student` (`id`);

ALTER TABLE `KindergartenSchema`.`NoteThread` ADD FOREIGN KEY (`schoolTermId`) REFERENCES `KindergartenSchema`.`SchoolTerm` (`id`);

ALTER TABLE `KindergartenSchema`.`NoteMessage` ADD FOREIGN KEY (`userId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`NoteMessage` ADD FOREIGN KEY (`noteThreadId`) REFERENCES `KindergartenSchema`.`NoteThread` (`id`);

ALTER TABLE `KindergartenSchema`.`Attendance` ADD FOREIGN KEY (`studentId`) REFERENCES `KindergartenSchema`.`Student` (`id`);

ALTER TABLE `KindergartenSchema`.`Attendance` ADD FOREIGN KEY (`checkinTeacherId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`Attendance` ADD FOREIGN KEY (`checkoutTeacherId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`Attendance` ADD FOREIGN KEY (`pickerRelativeId`) REFERENCES `KindergartenSchema`.`Relative` (`id`);

ALTER TABLE `KindergartenSchema`.`Attendance` ADD FOREIGN KEY (`schoolTermId`) REFERENCES `KindergartenSchema`.`SchoolTerm` (`id`);

ALTER TABLE `KindergartenSchema`.`Timetable` ADD FOREIGN KEY (`classId`) REFERENCES `KindergartenSchema`.`Class` (`id`);

ALTER TABLE `KindergartenSchema`.`Lecture` ADD FOREIGN KEY (`timetableId`) REFERENCES `KindergartenSchema`.`Timetable` (`id`);

ALTER TABLE `KindergartenSchema`.`MenuClassRelationship` ADD FOREIGN KEY (`menuId`) REFERENCES `KindergartenSchema`.`Menu` (`id`);

ALTER TABLE `KindergartenSchema`.`MenuClassRelationship` ADD FOREIGN KEY (`classId`) REFERENCES `KindergartenSchema`.`Class` (`id`);

ALTER TABLE `KindergartenSchema`.`Meal` ADD FOREIGN KEY (`menuId`) REFERENCES `KindergartenSchema`.`Menu` (`id`);

ALTER TABLE `KindergartenSchema`.`Dish` ADD FOREIGN KEY (`mealId`) REFERENCES `KindergartenSchema`.`Meal` (`id`);

ALTER TABLE `KindergartenSchema`.`DailyRemark` ADD FOREIGN KEY (`teacherId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`DailyRemark` ADD FOREIGN KEY (`studentId`) REFERENCES `KindergartenSchema`.`Student` (`id`);

ALTER TABLE `KindergartenSchema`.`DailyRemark` ADD FOREIGN KEY (`schoolTermId`) REFERENCES `KindergartenSchema`.`SchoolTerm` (`id`);

ALTER TABLE `KindergartenSchema`.`DailyRemarkActivity` ADD FOREIGN KEY (`dailyRemarkId`) REFERENCES `KindergartenSchema`.`DailyRemark` (`id`);

ALTER TABLE `KindergartenSchema`.`PeriodRemark` ADD FOREIGN KEY (`teacherId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`PeriodRemark` ADD FOREIGN KEY (`studentId`) REFERENCES `KindergartenSchema`.`Student` (`id`);

ALTER TABLE `KindergartenSchema`.`PeriodRemark` ADD FOREIGN KEY (`schoolTermId`) REFERENCES `KindergartenSchema`.`SchoolTerm` (`id`);

ALTER TABLE `KindergartenSchema`.`TuitionFee` ADD FOREIGN KEY (`studentId`) REFERENCES `KindergartenSchema`.`Student` (`id`);

ALTER TABLE `KindergartenSchema`.`Album` ADD FOREIGN KEY (`teacherId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`Album` ADD FOREIGN KEY (`classId`) REFERENCES `KindergartenSchema`.`Class` (`id`);

ALTER TABLE `KindergartenSchema`.`Album` ADD FOREIGN KEY (`schoolTermId`) REFERENCES `KindergartenSchema`.`SchoolTerm` (`id`);

ALTER TABLE `KindergartenSchema`.`AlbumTopicRelationship` ADD FOREIGN KEY (`albumId`) REFERENCES `KindergartenSchema`.`Album` (`id`);

ALTER TABLE `KindergartenSchema`.`AlbumTopicRelationship` ADD FOREIGN KEY (`topicId`) REFERENCES `KindergartenSchema`.`AlbumTopic` (`id`);

ALTER TABLE `KindergartenSchema`.`Noti` ADD FOREIGN KEY (`userId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`Noti` ADD FOREIGN KEY (`classId`) REFERENCES `KindergartenSchema`.`Class` (`id`);

ALTER TABLE `KindergartenSchema`.`Noti` ADD FOREIGN KEY (`createUserId`) REFERENCES `KindergartenSchema`.`User` (`id`);

ALTER TABLE `KindergartenSchema`.`UserNotification` ADD FOREIGN KEY (`userId`) REFERENCES `KindergartenSchema`.`User` (`id`);

COMMIT;
