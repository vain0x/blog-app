import React from "react"
import { Link } from "../client/ui_link"
import { UrlPath } from "../core/util_url_path"
import { POSTS_INDEX_ROUTE, newPostsViewRoute, newPostsIndexRoute } from "../pages/page_routes_client"
import { PageLoadResult, UnknownClientPage, UNKNOWN_CLIENT_PAGE } from "../pages/page_types"
import { toInt } from "../core/util_int"

type PostId = number

export interface PostListItem {
  postId: PostId
  title: string
  author: string
}

export interface PostList {
  pageNumber: number
  totalCount: number
  items: PostListItem[]
}

interface Props {
  state: UnknownClientPage
}

interface State extends UnknownClientPage {
  /**
   * 読み込み中は null
   */
  list?: PostList | null
}

const INITIAL_STATE: State = {
  ...UNKNOWN_CLIENT_PAGE,
  list: null,
}

export const loadPostsIndexPage = (path: UrlPath): PageLoadResult | null => {
  if (path.pathname !== POSTS_INDEX_ROUTE.pathname) {
    return null
  }

  const pageNumber = Math.max(toInt(path.query?.pageNumber) ?? 1, 1)

  // TODO: fetch items
  return {
    kind: "PAGE_LOAD_RESULT_RENDER",
    route: newPostsIndexRoute(pageNumber),
    state: INITIAL_STATE,
    render,
  }
}

const render: React.FC<Props> = props => {
  const state = props.state as State
  const { list } = state

  // TODO: ページネーション
  return (
    <article className="flex-stretch flex-cross-center g-flex-column" style={{ minWidth: "300px" }}>
      <h2>記事一覧</h2>

      <ul className="g-flex-column g-vertical-scroll">
        {list != null && list.items.length === 0 ? (
          <li>
            記事が見つかりません。
          </li>
        ) : list != null ? (
          list.items.map(({ postId, title, author }) => (
            <li key={postId} className="flex-cross-center g-flex-row">
              <Link className="flex-stretch" dest={newPostsViewRoute(postId)}>
                {title}
              </Link>

              <div>
                {author}
              </div>
            </li>
          ))
        ) : (
              <li>
                読み込み中...
              </li>
            )}
      </ul>

      <div className="flex-cross-center">
        {"<< < 1 2 3 4 5 > >>"}
      </div>
    </article>
  )
}
