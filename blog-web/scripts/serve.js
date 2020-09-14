// サーバーを起動し、ソースコードが変更されるたびに自動で再起動する。
// 参考: <https://codeburst.io/dont-use-nodemon-there-are-better-ways-fc016b50b45e>

/* eslint-disable no-constant-condition */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */

const chokidar = require("chokidar")
const path = require("path")
const { Subscription } = require("./subscription")

/**
 * 複数個のイベントがほぼ同時に発生したとき、
 * 処理が複数回実行されるのを防ぐための待ち時間
 */
const THROTTLE_MILLIS = 300

/**
 * 処理中にイベントが発生したときに、
 * 処理が連続で実行されるのを防ぐための待ち時間
 */
const DEBOUNCE_MILLIS = 1500

/** エラーが発生してからリトライするまでの待ち時間 */
const RETRY_MILLIS = 3000

const APP_DIR = path.resolve(__dirname, "..")

/**
 * 監視対象のディレクトリ
 */
const WATCHED_DIRS = [
  path.join(APP_DIR, "target/core"),
  path.join(APP_DIR, "target/pages"),
  path.join(APP_DIR, "target/server"),
]

/**
 * 一定時間待つ
 */
const delay = timeoutMillis => new Promise(resolve => setTimeout(resolve, timeoutMillis))

/**
 * 非同期関数に多重実行の防止機能やリトライ機能などを追加する。
 */
const enhanceAsyncFun = bodyFn => {
  let lastId = 0
  let running = false

  return async () => {
    while (true) {
      let ok = false

      lastId++
      const taskId = lastId

      await delay(THROTTLE_MILLIS)
      if (taskId !== lastId || running) {
        return
      }

      try {
        running = true
        await bodyFn()
        ok = true
      } catch (err) {
        console.error("ERROR", err)
      } finally {
        running = false
      }

      if (ok && taskId === lastId) {
        return
      }

      await delay(ok ? DEBOUNCE_MILLIS : RETRY_MILLIS)
    }
  }
}

/**
 * サーバーを再起動する。
 *
 * node_modules に含まれるモジュールをリロードしないので、
 * Node.js のプロセスを再起動するより速いはず。
 */
const doReloadServer = async subscription => {
  if (subscription != null) {
    console.log("serve: サーバーを停止しています……")
    await subscription.unsubscribe()
  }
  subscription = new Subscription()

  for (const key of Object.keys(require.cache)) {
    if (!key.includes("node_modules")) {
      delete require.cache[key]
    }
  }

  console.log("serve: サーバーを起動しています……")
  const { startServer } = require(path.join(APP_DIR, "target/server/main"))
  startServer(subscription)
  return subscription
}

const main = () => {
  let subscription = null

  const reloadServer = enhanceAsyncFun(async () => {
    subscription = await doReloadServer(subscription)
  })

  // 監視対象のディレクトリでファイルが作成・変更・削除されるたびにサーバーのリロードを行う。
  const watcher = chokidar.watch(WATCHED_DIRS)
  watcher.on("ready", () => {
    watcher.on("all", () => {
      // console.log("serve: ソースファイルが変更されました")
      reloadServer()
    })
  })

  reloadServer()
}

main()
