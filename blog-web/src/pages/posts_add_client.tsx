import React from "react"
import { Link } from "../client/ui_link"
import { LoginUser } from "../core/login_user"
import {
  HOME_ROUTE,
  POSTS_ADD_ROUTE,
} from "../pages/page_routes_client"
import {
  UnknownClientPage,
  UNKNOWN_CLIENT_PAGE,
  PageLoadResult,
} from "../pages/page_types"

interface Props extends React.Props<unknown> {
  loginUser: LoginUser
  state: UnknownClientPage
  putState: (state: UnknownClientPage) => void
}

interface State extends UnknownClientPage {
  title: string
  text: string
}

const INITIAL_STATE: State = {
  ...UNKNOWN_CLIENT_PAGE,
  title: "",
  text: "hello! hello!",
}

export const loadPostsAddPage = (): PageLoadResult => {
  return {
    kind: "PAGE_LOAD_RESULT_RENDER",
    route: POSTS_ADD_ROUTE,
    state: INITIAL_STATE,
    render,
  }
}

// TODO: 編集中のページ遷移をブロックしたい
const submit = async (state: unknown) => {
  // TODO: confirm ダイアログを出したい

  try {
    const res = await fetch("/posts/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    })

    if (!res.ok) {
      throw new Error("server not responding")
    }

    // TODO: ページ遷移したい
    window.alert("OK")
  } catch (err) {
    console.error(err)
    window.alert("something wrong")
  }
}

const render: React.FC<Props> = props => {
  const state = props.state as State
  const putState = props.putState as (state: State) => void

  return (
    <article className="flex-stretch flex-cross-center g-flex-column" style={{ minWidth: "300px" }}>
      <h2>投稿</h2>

      <form className="flex-stretch g-flex-column" onSubmit={ev => {
        ev.preventDefault()
        submit(state)
      }}>
        <dl>
          <dt>
            タイトル
          </dt>
          <dd className="g-flex-row">
            <input
              type="text" className="flex-stretch" size={8}
              required
              value={state.title}
              onChange={ev => putState({ ...state, title: ev.target.value })} />
          </dd>
        </dl>

        <textarea className="flex-stretch" required rows={8} value={state.text} onChange={ev => {
          putState({ ...state, text: ev.target.value })
        }} />

        <div className="g-flex-row" style={{ justifyContent: "flex-end" }}>
          <Link dest={HOME_ROUTE}>
            戻る
          </Link>

          <button>
            登録
          </button>
        </div>
      </form>
    </article>
  )
}
