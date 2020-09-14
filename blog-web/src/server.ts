// サーバーサイドのエントリーポイント

import { startServer } from "./server/main"
import { Subscription } from "./core/util_subscription"

startServer(new Subscription())
