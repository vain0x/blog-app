import { WebActionResult } from "../server/web_action_types"

// TODO: ページ遷移後にログアウトしましたみたいなメッセージを出したい
export const processAuthLogoutPostAction = (): WebActionResult => {
  return {
    kind: "WEB_ACTION_RESULT_CLEAR_SESSION",
    result: {
      kind: "WEB_ACTION_RESULT_REDIRECT",
      url: "/auth/login",
    },
  }
}
