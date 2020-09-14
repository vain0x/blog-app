import React from "react"
import ReactDOM from "react-dom"
import { History, createBrowserHistory } from "history"
import { LoginUser } from "../core/login_user"
import { performRoutingOnClient, loadPage } from "../pages/page_actions_client"
import { ClientRoute, HOME_ROUTE } from "../pages/page_routes_client"
import { UnknownClientPage, UpdatePageFn, UNKNOWN_CLIENT_PAGE, PageProps } from "../pages/page_types"
import { urlPathFromString, UrlPath, urlPathToString } from "../core/util_url_path"
import { NavigationContext } from "./ui_context"
import { MainLayout } from "./layout_main"

export const main = async () => {
  // クライアントアプリの開始時の処理や DI などを行う。

  // React に操作させる DOM ノードをみつける。
  const appContainerElement = document.getElementById("app-container") as HTMLElement

  // HTML に埋め込まれたデータを取り出す。
  const loginUserScriptElement = document.getElementById("login-user-script") as HTMLScriptElement
  const loginUser = JSON.parse(loginUserScriptElement.getAttribute("data-json") ?? "") as LoginUser
  // const initialDataScriptElement = document.getElementById("initial-data-script") as HTMLScriptElement
  // const initialData = JSON.parse(initialDataScriptElement.getAttribute("data-json") ?? "") as UnknownClientPage

  // ナビゲーション周りの初期設定を行う。
  const browserHistory = createBrowserHistory() as History<UnknownClientPage>
  const initialPath = urlPathFromString(browserHistory.createHref(browserHistory.location))
  const initialRoute: ClientRoute = performRoutingOnClient(initialPath) ?? HOME_ROUTE
  const initialPage = UNKNOWN_CLIENT_PAGE

  let currentRoute = initialRoute
  let currentPage = initialPage
  let currentRender: React.FC<PageProps>

  const setPage = (route: ClientRoute, page: UnknownClientPage, render: React.FC<PageProps>): void => {
    currentRoute = route
    currentPage = page
    currentRender = render
    renderDom()
  }

  const putPageState: UpdatePageFn = (page: UnknownClientPage) => {
    setPage(currentRoute, page, currentRender)
  }

  // const pushHistory = (url: string, state: UnknownClientPage): void =>
  //   browserHistory.push(url, state)

  // url === "" を指定しても URL が書き換わらないが、"/" を設定すると "" になる。
  const replaceHistory = (url: string, state: UnknownClientPage): void =>
    browserHistory.replace(url !== "" ? url : "/", state)

  const restoreFromHistory = (url: string, state: UnknownClientPage) => {
    const path = urlPathFromString(url)
    const route = performRoutingOnClient(path)
    if (route == null) {
      // 履歴上にある URL に対応するページが存在しないということはないはず。
      console.error("not found", url)
      return
    }

    currentRoute = route
    currentPage = state
  }

  const navigate = (route: ClientRoute): void => {
    const result = loadPage(route)
    if (result == null) {
      console.error("navigation failed", route)
      return
    }

    setPage(result.route, result.state, result.render)
  }

  const renderDom = () => {
    const route = currentRoute
    const state = currentPage
    const Page = currentRender

    const url = urlPathToString(route as unknown as UrlPath)
    console.log("[TRACE] ReactDOM.render", url)

    ReactDOM.render(
      (
        <NavigationContext.Provider value={navigate}>
          <MainLayout loginUser={loginUser}>
            <Page
              loginUser={loginUser}
              state={state}
              putState={putPageState} />
          </MainLayout>
        </NavigationContext.Provider>
      ),
      appContainerElement,
      () => {
        replaceHistory(url, state)
      },
    )
  }

  // イベントを購読する:

  browserHistory.listen(({ location, action }) => {
    if (action === "POP") {
      const url = browserHistory.createHref(location)
      const state = location.state as UnknownClientPage
      restoreFromHistory(url, state)
    }
  })

  // 開始:
  {
    const result = loadPage(currentRoute)
    if (result == null) {
      console.error("not found", result)
      return
    }

    setPage(result.route, result.state, result.render)
  }
}
