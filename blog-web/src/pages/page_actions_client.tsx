// import React from "react"
import { exhaust, checkExhaustive } from "../core/util_never"
import { UrlPath } from "../core/util_url_path"
import {
  ClientRoute,
  HOME_ROUTE,
  POSTS_INDEX_ROUTE,
  POSTS_ADD_ROUTE,
} from "../pages/page_routes_client"
import { loadPostsIndexPage } from "../pages/posts_index_client"
import { loadPostsViewPage } from "../pages/posts_view_client"
import { loadPostsAddPage } from "../pages/posts_add_client"
import { PageLoadResult } from "../pages/page_types"
import { loadHome } from "./home_index_client"

export const performRoutingOnClient = (path: UrlPath): ClientRoute | null => {
  const pathname = path.pathname as ClientRoute["pathname"]
  switch (pathname) {
    case "/home":
      return HOME_ROUTE

    case "/posts/":
      return loadPostsIndexPage(path)?.route ?? null

    case "/posts/view":
      return loadPostsViewPage(path)?.route ?? null

    case "/posts/add":
      return loadPostsAddPage()?.route ?? null

    default:
      checkExhaustive(pathname)
      return null
  }
}

/**
 * ページの読み込み処理を計算する。
 */
export const loadPage = (route: ClientRoute): PageLoadResult | null => {
  switch (route.pathname) {
    case HOME_ROUTE.pathname:
      return loadHome(route)

    case POSTS_INDEX_ROUTE.pathname:
      return loadPostsIndexPage(route)

    case "/posts/view":
      return loadPostsViewPage(route)

    case POSTS_ADD_ROUTE.pathname:
      return loadPostsAddPage()

    default:
      throw exhaust(route)
  }
}
