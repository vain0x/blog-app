import React from "react"
import { ClientRoute } from "../pages/page_routes_client"

// 参考: https://reactjs.org/docs/context.html
export const NavigationContext = React.createContext((_route: ClientRoute): void => {
  throw new Error("Out of NavigationContext")
})
