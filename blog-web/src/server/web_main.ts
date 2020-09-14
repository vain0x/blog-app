import compression from "compression"
import cookieSession from "cookie-session"
import express from "express"
import { createServer } from "http"
import morgan from "morgan"
import path from "path"
import { AccessToken } from "../core/access_token"
import { LoginUser } from "../core/login_user"
import { exhaust } from "../core/util_never"
import { Subscription } from "../core/util_subscription"
import { urlPathFromString } from "../core/util_url_path"
import { WebActionResult } from "../server/web_action_types"
import { appendHttpHeadersForSecurity } from "../server/web_security"
import { processWebAction } from "../pages/page_actions_server"

interface ReqSession {
  accessToken?: AccessToken
}

const DAY_MILLIS = 24 * 60 * 60 * 1000
const YEAR_MILLIS = 365 * DAY_MILLIS

const DIST_DIR = path.resolve(__dirname, "../../dist")

const reqToAccessToken = (req: express.Request) =>
  (req.session as ReqSession).accessToken ?? null

const reqSetAccessToken = (req: express.Request, accessToken: AccessToken | null) =>
  (req.session as ReqSession).accessToken = accessToken ?? undefined

const handleError = (err: unknown, res: express.Response): void => {
  // FIXME: err の種類をみて 400 や 404 を返す。
  console.error(err)
  res.sendStatus(500)
  return
}

const performResult = (result: WebActionResult, req: express.Request, res: express.Response): void => {
  switch (result.kind) {
    case "WEB_ACTION_RESULT_RENDER":
      res.contentType("text/html").send(result.html).end()
      return

    case "WEB_ACTION_RESULT_JSON":
      res.json(result.obj)
      return

    case "WEB_ACTION_RESULT_REDIRECT":
      res.redirect(result.url)
      return

    case "WEB_ACTION_RESULT_ERROR":
      handleError(result.err, res)
      return

    case "WEB_ACTION_RESULT_GET_ACCESS_TOKEN": {
      const accessToken = reqToAccessToken(req)
      return performResult(result.cont(accessToken), req, res)
    }
    case "WEB_ACTION_RESULT_REQUEST_AUTHENTICATION": {
      // 認証は未実装なので、アクセストークンがあれば OK とする。
      const accessToken = reqToAccessToken(req)
      if (accessToken == null) {
        return performResult(result.reject(), req, res)
      }

      const loginUser: LoginUser = {
        userId: 1,
        name: "John Doe",
      }
      return performResult(result.cont(accessToken, loginUser), req, res)
    }
    case "WEB_ACTION_RESULT_SET_ACCESS_TOKEN": {
      reqSetAccessToken(req, result.accessToken)
      return performResult(result.result, req, res)
    }
    case "WEB_ACTION_RESULT_CLEAR_SESSION": {
      console.log("clear session", result)
      req.session = null
      return performResult(result.result, req, res)
    }
    case "WEB_ACTION_RESULT_GET_BODY":
      return performResult(result.cont(req.body), req, res)

    default:
      throw exhaust(result)
  }
}

const createExpressRouter = (): express.Router => {
  const router = express.Router()

  const staticFileHandler = express.static(DIST_DIR)
  router.get("/static/*", staticFileHandler)

  router.all("*", (req, res) => {
    const path = urlPathFromString(req.url)
    performResult(processWebAction(path, req.method), req, res)
  })

  return router
}

export const startWebServer = (subscription: Subscription) => {
  const port = 8080
  const origin = "http://localhost:8080"
  const cookieSecret = "1da799ecf23a38c90cbe72b2817291c8" // random

  const app = express()

  // (開発用) リクエストの URL や処理時間などをログ出力する。
  app.use(morgan("dev"))

  // レスポンスのボディが大きかったら圧縮する。
  app.use(compression())

  app.use(appendHttpHeadersForSecurity)

  // JSON 形式のレスポンスボディを解析する。
  app.use(express.json())

  // セッション単位の永続化データをクッキーに持たせる。
  app.use(cookieSession({
    maxAge: YEAR_MILLIS,
    sameSite: "lax",
    secret: cookieSecret,
  }))

  app.use(createExpressRouter())

  const server = createServer(app).listen(port, () => {
    console.log(`[INFO] Server is ready. Visit ${origin}`)
  })

  subscription.subscribe(() => server.close())
}
