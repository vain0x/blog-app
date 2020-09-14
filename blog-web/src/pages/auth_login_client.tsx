import React from "react"

export const AuthLoginPage: React.FC = () => {
  return (
    <article className="flex-stretch flex-cross-center g-flex-column" style={{ minWidth: "300px" }}>
      <h2>ログイン</h2>

      <form method="POST" className="g-flex-column">
        <label className="g-flex-row">
          <div>ユーザーID</div>
          <input type="username" autoComplete="username" required />
        </label>

        <label className="g-flex-row">
          <div>パスワード</div>
          <input type="password" autoComplete="password" required />
        </label>

        <div className="g-flex-row" style={{ justifyContent: "flex-end" }}>
          <button>ログイン</button>
        </div>

        <div>
          ※サンプルなのでIDやパスワードはチェックされません。
        </div>
      </form>
    </article>
  )
}
