import { useRouter } from "expo-router";
import moment from "moment";
import React from "react";
import { FlatList, Image, View } from "react-native";
import { Text } from "react-native-paper";
import medicineIcon from "../../../../assets/images/medicine-icon.png";
import LetterStatusText from "../StatusText";
import CustomCard from "../../CustomCard";
import { MedLetterItem } from "../../../models/MedicineModels";

type ItemListProps = {
  items: MedLetterItem[];
  isTeacher: boolean;
  onRefresh: () => void;
  refreshing: boolean;
};

export function MedicineLetterList({
  items,
  isTeacher,
  onRefresh,
  refreshing
}: ItemListProps): React.ReactElement {
  const router = useRouter();
  const renderItem = ({ item }: { item: MedLetterItem }) => {
    const startDate = moment(item.startDate);
    const endDate = moment(item.endDate);
    const createdAt = moment(item.createdAt);
    const diffDate = endDate.diff(startDate, "days");
    return (
      <CustomCard
        onPress={() => {
          router.push({
            pathname: `${
              isTeacher ? "teacher" : "parent"
            }/medicine/letter-detail-screen`,
            params: { id: item.id, studentName: item.studentName }
          });
        }}
      >
        <Text variant={"labelLarge"} className={"mb-2"}>
          Dặn thuốc {`cho bé ${item.studentName} `}
          <Text className={"italic"}>
            ({startDate.format("DD/MM/YYYY")}
            {diffDate == 0 ? "" : ` đến ${endDate.format("DD/MM/YYYY")}`})
          </Text>{" "}
        </Text>
        <View className={"flex flex-row justify-between gap-x-4 "}>
          <Image className={"aspect-square w-1/6"} source={medicineIcon} />
          <View className={"flex-grow flex-col gap-y-1 whitespace-nowrap"}>
            <Text
              variant={"bodyMedium"}
              numberOfLines={1}
              className="overflow-hidden"
            >
              {item.note}{" "}
            </Text>
            <Text variant={"bodyMedium"} className={"italic"}>
              Ngày tạo: {createdAt.format("DD/MM/YYYY")}
            </Text>
            <LetterStatusText status={item.status} />
          </View>
        </View>
      </CustomCard>
    );
  };

  return (
    <FlatList
      onRefresh={onRefresh}
      refreshing={refreshing}
      contentContainerStyle={{ gap: 8, paddingBottom: 8, paddingTop: 8 }}
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
}
