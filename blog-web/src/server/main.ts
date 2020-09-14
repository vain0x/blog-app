import { startWebServer } from "./web_main"
import { Subscription } from "../core/util_subscription"

export const startServer = (subscription: Subscription): void => {
  // 設定ファイルを読んだり DI したりする。(予定)

  startWebServer(subscription)
}
