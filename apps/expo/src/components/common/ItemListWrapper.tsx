import { View, ScrollView, RefreshControl } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function ItemListWrapper({
  fetchData,
  isEmpty,
  emptyPlaceHolderText,
  children
}: {
  fetchData: () => void;
  isFetching: boolean;
  isEmpty: boolean;
  emptyPlaceHolderText: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <View className="flex-1">
      {!isEmpty ? (
        children
      ) : (
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={fetchData} />
          }
        >
          <View className="rounded-sm p-4">
            <Text
              className={"text-center"}
              variant={"titleLarge"}
              style={{ color: theme.colors.onSurfaceDisabled }}
            >
              {emptyPlaceHolderText}
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
