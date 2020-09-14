import React from "react"
import { UrlPath } from "../core/util_url_path"
import { HOME_ROUTE } from "../pages/page_routes_client"
import { PageLoadResult, UNKNOWN_CLIENT_PAGE } from "./page_types"

export const loadHome = (route: UrlPath): PageLoadResult | null => {
  if (route.pathname !== HOME_ROUTE.pathname) {
    return null
  }

  return {
    kind: "PAGE_LOAD_RESULT_RENDER",
    route: HOME_ROUTE,
    state: UNKNOWN_CLIENT_PAGE,
    render,
  }
}

const render: React.FC = () => {
  return (
    <div className="flex-stretch g-center">
      Home
    </div>
  )
}
