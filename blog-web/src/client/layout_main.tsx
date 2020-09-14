import React from "react"
import { Link } from "../client/ui_link"
import {
  HOME_ROUTE,
  POSTS_INDEX_ROUTE,
  POSTS_ADD_ROUTE,
} from "../pages/page_routes_client"

interface Props extends React.Props<unknown> {
  loginUser: {
    name: string
  }
}

export const MainLayout: React.FC<Props> = props => {
  const {
    loginUser: { name },
    children,
  } = props

  return (
    <article id="g-main-layout" className="flex-stretch g-flex-column">
      <header className="g-flex-row">
        <h2 className="flex-stretch">
          <Link className="g-anchor-silent" dest={HOME_ROUTE}>
            MY BLOG
          </Link>
        </h2>

        {name}さん

        <LogoutButton />
      </header>

      {children}

      <footer className="g-flex-row">
        <Link dest={POSTS_INDEX_ROUTE}>
          [記事一覧]
        </Link>

        <Link dest={POSTS_ADD_ROUTE}>
          [新しい記事]
        </Link>
      </footer>
    </article>
  )
}

const LogoutButton: React.FC = () => (
  <form action="/auth/logout" method="POST">
    <button style={{ fontSize: "1.2rem" }}>
      ログアウト
    </button>
  </form>
)
