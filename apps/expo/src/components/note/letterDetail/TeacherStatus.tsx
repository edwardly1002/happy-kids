import React, { useContext, useState } from "react";
import { View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { api } from "../../../utils/api";
import LetterStatusDialog from "../../medicine/modals/OptionDialog";
import LetterStatusText from "../../medicine/StatusText";
import { NoteThreadStatus } from "../../../models/NoteModels";
import { trpcErrorHandler } from "../../../utils/trpc-error-handler";
import { ErrorContext } from "../../../utils/error-context";
import { useAuthContext } from "../../../utils/auth-context-provider";

const TeacherStatus = ({
  status,
  refetch,
  noteThreadId
}: {
  userId: string;
  status: NoteThreadStatus;
  refetch: () => void;
  noteThreadId: string;
}) => {
  const theme = useTheme();
  const errorContext = useContext(ErrorContext);
  const authContext = useAuthContext();

  const [visibleStatusDialog, setVisibleStatusDialog] = useState(false);
  const [statusLetter, setStatusLetter] = useState(status);

  const updateStatMutation = api.note.updateNoteStatus.useMutation({
    onSuccess: () => refetch(),
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  return (
    <View>
      <View className="mt-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text variant={"labelLarge"}>Trạng thái đơn</Text>
        </View>
        <View className={"flex-row items-center justify-end text-right"}>
          <IconButton
            icon={"pencil"}
            iconColor={theme.colors.primary}
            size={16}
            mode={"outlined"}
            onPress={() => {
              setVisibleStatusDialog(true);
            }}
          />
          <LetterStatusText status={statusLetter} />
        </View>
      </View>

      <LetterStatusDialog
        origValue={statusLetter}
        setOrigValue={(value: NoteThreadStatus) => {
          updateStatMutation.mutate({
            noteThreadId: noteThreadId,
            status: value
          });
          setStatusLetter(value);
        }}
        visible={visibleStatusDialog}
        close={() => setVisibleStatusDialog(false)}
      />
    </View>
  );
};

export default TeacherStatus;
