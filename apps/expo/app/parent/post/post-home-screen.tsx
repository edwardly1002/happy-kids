import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../src/utils/api";
import { FlatList } from "react-native";
import Body from "../../../src/components/Body";
import { useIsFocused } from "@react-navigation/native";
import { PostItemModel } from "../../../src/models/PostModels";
import PostItem from "../../../src/components/post/PostItem";
import AlertModal from "../../../src/components/common/AlertModal";
import { trpcErrorHandler } from "../../../src/utils/trpc-error-handler";
import { ErrorContext } from "../../../src/utils/error-context";
import { useAuthContext } from "../../../src/utils/auth-context-provider";
import LoadingBar from "../../../src/components/common/LoadingBar";

const ITEM_PER_PAGE = 5;

const PostHomeScreen = () => {
  const isFocused = useIsFocused();
  const authContext = useAuthContext();
  const errorContext = useContext(ErrorContext);

  const [posts, setPosts] = useState<PostItemModel[]>([]);
  const [page, setPage] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const postMutation = api.post.getPostList.useMutation({
    onSuccess: (resp) => {
      const tmp = posts;
      setPosts(
        tmp.concat(
          resp.posts.filter(
            (item) => posts.filter((item2) => item2.id == item.id).length == 0
          )
        )
      );

      if (!resp.hasNextPage) {
        setPage(-1);
      } else {
        const tmp = page;
        setPage(tmp + 1);
      }
    },
    onError: ({ message, data }) =>
      trpcErrorHandler(() => {})(
        data?.code ?? "",
        message,
        errorContext,
        authContext
      )
  });

  useEffect(() => {
    refresh();
  }, [isFocused]);

  const refresh = () => {
    setPage(0);
    setPosts([]);

    !postMutation.isLoading &&
      postMutation.mutate({
        page: 0,
        itemsPerPage: ITEM_PER_PAGE
      });
  };

  const infiniteRender = () => {
    if (page === -1) return;

    !postMutation.isLoading &&
      postMutation.mutate({
        page: page,
        itemsPerPage: ITEM_PER_PAGE
      });
  };

  return (
    <Body>
      <LoadingBar isFetching={postMutation.isLoading} />

      <FlatList
        onRefresh={() => refresh()}
        refreshing={postMutation.isLoading}
        contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
        data={posts}
        renderItem={({ item }: { item: PostItemModel }) => (
          <PostItem item={item} isTeacher={false} />
        )}
        // ListHeaderComponent={() => <PostHeader userInfo={userInfo} />}
        onEndReached={() => infiniteRender()}
      />

      <AlertModal
        visible={errorMessage != ""}
        title={"Thông báo"}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </Body>
  );
};

export default PostHomeScreen;
