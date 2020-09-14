import { UrlPath } from "../core/util_url_path"
import { PostData } from "./posts_view_client"
import { toInt } from "../core/util_int"

export const processPostsViewGetAction = async (path: UrlPath): Promise<PostData> => {
  return {
    postId: toInt(path.query?.id) ?? 1,
    title: "表題",
    text: "本文.",
    author: "未詳",
  }
}
