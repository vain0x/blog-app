import React from "react"
import { renderHtmlToString } from "../server/layout_html"
import { WebActionResult } from "../server/web_action_types"
import { AuthLoginPage } from "./auth_login_client"
import { HOME_ROUTE } from "../pages/page_routes_client"

export const processAuthLoginGetAction = (): WebActionResult => {
  return {
    kind: "WEB_ACTION_RESULT_REQUEST_AUTHENTICATION",
    cont: redirectToHome,
    reject: renderLogin,
  }
}

const redirectToHome = (): WebActionResult => ({
  kind: "WEB_ACTION_RESULT_REDIRECT",
  url: HOME_ROUTE.pathname,
})

const renderLogin = (): WebActionResult => ({
  kind: "WEB_ACTION_RESULT_RENDER",
  html: renderHtmlToString(
    "ログイン | My Blog App",
    NullComponent,
    AuthLoginPage,
  ),
})

const NullComponent: React.FC = () => null
