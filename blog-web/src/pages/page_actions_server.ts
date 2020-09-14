import assert from "assert"
import { exhaust, checkExhaustive } from "../core/util_never"
import { UrlPath, urlPathToString } from "../core/util_url_path"
import { performRoutingOnClient } from "./page_actions_client"
import { WebActionResult } from "../server/web_action_types"
import { renderHtmlToString, AppBody, AppHead } from "../server/layout_html"
import { processAuthLoginPostAction } from "./auth_login_post"
import { processAuthLogoutPostAction } from "./auth_logout_post"
import { processPostsAddPostAction } from "./posts_add_server"
import { processAuthLoginGetAction } from "./auth_login_get"

/**
 * サーバーサイドのルーティングの結果
 *
 * (static は除く。)
 */
export type ServerRoute =
  {
    pathname: "/posts/add"
    method: "POST"
  } | {
    pathname: "/auth/login"
    method: "GET" | "POST"
  } | {
    pathname: "/auth/logout"
    method: "POST"
  }

export const performRoutingOnServer = (path: UrlPath, method: string): ServerRoute | null => {
  const pathname = path.pathname as ServerRoute["pathname"]
  switch (pathname) {
    case "/auth/login":
      if (method !== "GET" && method !== "POST") {
        return null
      }

      return {
        pathname: "/auth/login",
        method,
      }

    case "/auth/logout":
      if (method !== "POST") {
        return null
      }

      return {
        pathname: "/auth/logout",
        method: "POST",
      }

    case "/posts/add":
      if (method !== "POST") {
        return null
      }

      return {
        pathname: "/posts/add",
        method: "POST",
      }

    default:
      checkExhaustive(pathname)
      return null
  }
}

const processForClientPage = (path: UrlPath, method: string): WebActionResult | null => {
  if (method != "GET") {
    return null
  }

  const route = performRoutingOnClient(path)
  if (route == null) {
    return null
  }

  return {
    kind: "WEB_ACTION_RESULT_REQUEST_AUTHENTICATION",
    reject: redirectToLogin,
    cont: (_accessToken, loginUser) => {
      // TODO: 必要なデータをフェッチする
      const data = {}

      return {
        kind: "WEB_ACTION_RESULT_RENDER",
        html: renderHtmlToString(
          "My Blog App",
          AppHead(loginUser, data),
          AppBody,
        ),
      }
    },
  }
}

const redirectToLogin = (): WebActionResult =>
  ({
    kind: "WEB_ACTION_RESULT_REDIRECT",
    url: "/auth/login",
  })

const processForServerPage = (path: UrlPath, method: string): WebActionResult => {
  const route = performRoutingOnServer(path, method)
  if (route == null) {
    if (method !== "GET") {
      throw new Error(`404 Not Found ${method} ${urlPathToString(path)}`)
    }

    return redirectToLogin()
  }

  switch (route.pathname) {
    case "/auth/login":
      switch (route.method) {
        case "GET":
          return processAuthLoginGetAction()

        case "POST":
          return processAuthLoginPostAction()

        default:
          throw exhaust(route.method)
      }

    case "/auth/logout":
      return processAuthLogoutPostAction()

    case "/posts/add":
      return processPostsAddPostAction()

    default:
      throw exhaust(route)
  }
}

export const processWebAction = (path: UrlPath, method: string): WebActionResult => {
  assert.ok(!path.pathname.startsWith("/static/"), "express のルーティングで処理済み")

  // クライアントのルーティングを先に試す。
  {
    const result = processForClientPage(path, method)
    if (result != null) {
      return result
    }
  }

  return processForServerPage(path, method)
}
