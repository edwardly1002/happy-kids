import { useRouter } from "expo-router";
import moment from "moment";
import React from "react";
import { FlatList, Image, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import leaveletterIcon from "../../../../assets/images/leave-letter-icon.png";
import LetterStatusText, { LetterStatus } from "../../medicine/StatusText";

export type LeaveLetterItem = {
  id: string;
  reason: string;
  status: LetterStatus;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  studentName: string;
};

type ItemListProps = {
  items: LeaveLetterItem[];
  isTeacher: boolean;
};

export function LeaveLetterList({
  items,
  isTeacher
}: ItemListProps): React.ReactElement {
  const router = useRouter();
  const theme = useTheme();
  const renderItem = ({ item }: { item: LeaveLetterItem }) => {
    const startDate = moment(item.startDate);
    const endDate = moment(item.endDate);
    const createdAt = moment(item.createdAt);
    const diffDate = endDate.diff(startDate, "days");
    return (
      <Card
        mode={"outlined"}
        style={{ backgroundColor: theme.colors.background, borderRadius: 2 }}
        onPress={() => {
          router.push({
            pathname: `${
              isTeacher ? "teacher" : "parent"
            }/leaveletter/letter-detail-screen`,
            params: { id: item.id, studentName: item.studentName }
          });
        }}
      >
        <Card.Content>
          <Text variant={"labelLarge"} className={"mb-2"}>
            Xin nghỉ {`cho bé ${item.studentName} `}
            <Text className={"italic"}>
              ({startDate.format("DD/MM/YYYY")}
              {diffDate == 0 ? "" : ` đến ${endDate.format("DD/MM/YYYY")}`})
            </Text>{" "}
          </Text>
          <View className={"flex flex-row justify-between gap-x-4 "}>
            <Image className={"aspect-square w-1/6"} source={leaveletterIcon} />
            <View className={"flex-grow flex-col gap-y-1 whitespace-nowrap"}>
              <Text
                variant={"bodyMedium"}
                numberOfLines={1}
                className="overflow-hidden"
              >
                {item.reason}{" "}
              </Text>
              <Text variant={"bodyMedium"} className={"italic"}>
                Ngày tạo: {createdAt.format("DD/MM/YYYY")}
              </Text>
              <LetterStatusText status={item.status} />
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <FlatList
      contentContainerStyle={{ gap: 8 }}
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
    />
  );
}
