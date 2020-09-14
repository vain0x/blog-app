import React from "react"
import { NavigationContext } from "../client/ui_context"
import { urlPathToString, UrlPath } from "../core/util_url_path"
import { ClientRoute } from "../pages/page_routes_client"

type ClientNavigateFn = (route: ClientRoute) => void

interface LinkProps extends React.Props<unknown> {
  dest: ClientRoute | null
  onClick?: (dest: ClientRoute, navigate?: ClientNavigateFn) => void

  className?: string
}

export const Link = (props: LinkProps) => {
  const { dest, children, className } = props
  const href = dest != null ? routeToString(dest) : undefined

  return (
    <NavigationContext.Consumer>
      {navigate => (
        <a className={className} href={href} onClick={ev => handleLinkClick(props, ev, navigate)}>
          {children}
        </a>
      )}
    </NavigationContext.Consumer>
  )
}

const routeToString = (route: ClientRoute): string =>
  urlPathToString(route as unknown as UrlPath)

const handleLinkClick = (props: LinkProps, ev: React.MouseEvent<HTMLAnchorElement>, navigate: ClientNavigateFn) => {
  const { dest, onClick } = props

  // 通常の左クリック以外 (右クリックや Ctrl+左クリック など) には反応しない。
  if (dest == null || !mouseEventIsNormalClick(ev)) {
    return
  }

  ev.preventDefault()

  if (onClick) {
    onClick(dest, navigate)
    return
  }

  navigate(dest)
}

const mouseEventIsNormalClick = (ev: React.MouseEvent): boolean => {
  const leftClick = ev.button === 0
  const modified = ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey
  return leftClick && !modified && !ev.defaultPrevented
}
