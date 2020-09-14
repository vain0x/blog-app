import { AccessToken } from "../core/access_token"
import { LoginUser } from "../core/login_user"

export type WebActionResult =
  {
    kind: "WEB_ACTION_RESULT_RENDER"
    html: string
  } | {
    kind: "WEB_ACTION_RESULT_JSON"
    obj: unknown
  } | {
    kind: "WEB_ACTION_RESULT_REDIRECT"
    url: string
  } | {
    kind: "WEB_ACTION_RESULT_ERROR"
    err: unknown
  } | {
    kind: "WEB_ACTION_RESULT_GET_ACCESS_TOKEN"
    cont: (accessToken: AccessToken | null) => WebActionResult
  } | {
    kind: "WEB_ACTION_RESULT_REQUEST_AUTHENTICATION"
    cont: (accessToken: AccessToken, loginUser: LoginUser) => WebActionResult
    reject: () => WebActionResult,
  } | {
    kind: "WEB_ACTION_RESULT_SET_ACCESS_TOKEN"
    accessToken: AccessToken
    result: WebActionResult
  } | {
    kind: "WEB_ACTION_RESULT_CLEAR_SESSION"
    result: WebActionResult
  } | {
    kind: "WEB_ACTION_RESULT_GET_BODY"
    cont: (body: unknown) => WebActionResult
  }
