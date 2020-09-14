import { AccessToken } from "../core/access_token"
import { HOME_ROUTE } from "../pages/page_routes_client"
import { WebActionResult } from "../server/web_action_types"

export const processAuthLoginPostAction = (): WebActionResult => {
  return {
    kind: "WEB_ACTION_RESULT_GET_BODY",
    cont: body => {
      // FIXME: パスワードの検証など
      const accessToken = "my-access-token" as AccessToken
      console.log("ログイン", body, accessToken)

      return {
        kind: "WEB_ACTION_RESULT_SET_ACCESS_TOKEN",
        accessToken,
        result: {
          kind: "WEB_ACTION_RESULT_REDIRECT",
          url: HOME_ROUTE.pathname,
        },
      }
    },
  }
}
