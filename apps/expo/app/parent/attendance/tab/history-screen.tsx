import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";
import AttendanceItem from "../../../../src/components/attendance/AttendanceItem";
import DateRangePicker from "../../../../src/components/DateRangePicker";
import { AttendanceItemModel } from "../../../../src/models/AttendanceModels";
import { api } from "../../../../src/utils/api";
import { AttendanceContext } from "../../../../src/utils/attendance-context";

const DEFAULT_TIME_END = moment(moment.now());
const DEFAULT_TIME_START = moment(moment.now()).subtract(7, "days");

const HistoryScreen = () => {
  // properties
  const { colors } = useTheme();
  const { studentId } = React.useContext(AttendanceContext) ?? {
    studentId: null
  };

  // states
  const [timeStart, setTimeStart] = useState<Moment>(DEFAULT_TIME_START);
  const [timeEnd, setTimeEnd] = useState<Moment>(DEFAULT_TIME_END);

  // data
  const [attendanceList, setAttendanceList] = useState<AttendanceItemModel[]>(
    []
  );
  const attMutation = api.attendance.getAttendanceList.useMutation({
    onSuccess: (resp) => setAttendanceList(resp.attendances)
  });

  // update list when search criterias change
  useEffect(() => {
    attMutation.mutate({
      timeStart: timeStart.toDate(),
      timeEnd: timeEnd.toDate(),
      studentId: studentId ?? ""
    });
  }, [studentId, timeStart, timeEnd]);

  return (
    <View className={"flex-1 bg-white px-2"}>
      <View className={"fixed my-4 flex-row justify-between"}>
        <View className={""}>
          <DateRangePicker
            initTimeStart={timeStart}
            initTimeEnd={timeEnd}
            setTimeStart={setTimeStart}
            setTimeEnd={setTimeEnd}
          />
        </View>

        <View className={"flex-row justify-between space-x-4"}>
          <Pressable className={""}>
            <View className={"m-auto"}>
              <AntDesign name={"filter"} size={25}></AntDesign>
            </View>
          </Pressable>
        </View>
      </View>

      <ScrollView>
        {attendanceList != null && attendanceList.length > 0 ? (
          attendanceList.map((item, key) => (
            <AttendanceItem key={key} {...item} />
          ))
        ) : (
          <View className={"mt-5 mb-10"}>
            <Text
              className={"text-center"}
              variant={"titleLarge"}
              style={{ color: colors.onSurfaceDisabled }}
            >
              Không có dữ liệu để hiển thị
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HistoryScreen;
