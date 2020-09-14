import React from "react"
import { LoginUser } from "../core/login_user"
import { ClientRoute } from "../pages/page_routes_client"

declare const IS_CLIENT_PAGE: unique symbol

/**
 * クライアントのページの状態 (詳細は不明)
 */
export type UnknownClientPage = { [IS_CLIENT_PAGE]: true }

export const UNKNOWN_CLIENT_PAGE = {} as UnknownClientPage

export type UpdatePageFn = (page: UnknownClientPage) => void

export type PageActionResult =
  {
    kind: "PAGE_ACTION_RESULT_RENDER"
    render: React.FC
  }

export type PageLoadResult =
  {
    kind: "PAGE_LOAD_RESULT_RENDER"
    route: ClientRoute
    state: UnknownClientPage
    render: React.FC<PageProps>
  }

export interface PageProps {
  loginUser: LoginUser
  state: UnknownClientPage
  putState: (state: UnknownClientPage) => void
}
