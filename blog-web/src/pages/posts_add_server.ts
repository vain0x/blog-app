import { WebActionResult } from "../server/web_action_types"

export const processPostsAddPostAction = (): WebActionResult => {
  return {
    kind: "WEB_ACTION_RESULT_GET_BODY",
    cont: body => {
      // TODO: バリデーション
      // TODO: データベースに登録
      console.log("投稿: ", body)

      return {
        kind: "WEB_ACTION_RESULT_JSON",
        obj: {},
      }
    },
  }
}
