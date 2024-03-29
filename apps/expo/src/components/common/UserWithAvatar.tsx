import { View } from "react-native";
import React from "react";
import { Avatar, Text } from "react-native-paper";
import defaultAvatar from "../../../assets/images/default-user-avatar.png";

const UserWithAvatar = ({
  avatar,
  name,
  extraInfo,
  rightButton
}: {
  avatar?: string | null;
  name?: string | null;
  extraInfo: string;
  rightButton?: React.ReactNode;
}) => {
  return (
    <View className={"w-full flex-row justify-between"}>
      <View className={"mb-2 flex-row space-x-2"}>
        <Avatar.Image
          className={"my-auto"}
          size={42}
          source={
            avatar ? { uri: `data:image/jpeg;base64,${avatar}` } : defaultAvatar
          }
        />
        <View>
          <Text className={""} variant={"titleSmall"}>
            {name ?? "Chưa có tên"}
          </Text>
          <Text className={""} variant={"bodyMedium"}>
            {extraInfo}
          </Text>
        </View>
      </View>
      {rightButton && <View>{rightButton}</View>}
    </View>
  );
};

export default UserWithAvatar;
