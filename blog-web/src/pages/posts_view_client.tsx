import React from "react"
import { toInt } from "../core/util_int"
import { Link } from "../client/ui_link"
import { UrlPath } from "../core/util_url_path"
import { POSTS_INDEX_ROUTE, newPostsViewRoute } from "../pages/page_routes_client"
import { PageLoadResult, UnknownClientPage, UNKNOWN_CLIENT_PAGE } from "../pages/page_types"

export interface PostData {
  postId: number
  title: string
  text: string
  author: string
}

interface Props {
  state: UnknownClientPage
}

interface State extends UnknownClientPage {
  data: PostData | null
}

const INITIAL_STATE: State = {
  ...UNKNOWN_CLIENT_PAGE,
  data: null,
}

export const loadPostsViewPage = (path: UrlPath): PageLoadResult | null => {
  const id = toInt(path?.query?.id)
  if (id == null) {
    return null
  }

  // TODO: データをフェッチする
  return {
    kind: "PAGE_LOAD_RESULT_RENDER",
    route: newPostsViewRoute(id),
    state: INITIAL_STATE,
    render,
  }
}

const render: React.FC<Props> = props => {
  const state = props.state as State
  if (state.data == null) {
    return (<div> loading... </div>)
  }

  const { title, author, text } = state.data

  return (
    <article className="flex-stretch flex-cross-center g-flex-column" style={{ minWidth: "300px" }}>
      <h2>
        {title}
      </h2>

      <div style={{ alignSelf: "flex-end" }}>
        {author}
      </div>

      <div>
        {text}
      </div>

      <Link dest={POSTS_INDEX_ROUTE}>
        戻る
      </Link>
    </article>
  )
}
