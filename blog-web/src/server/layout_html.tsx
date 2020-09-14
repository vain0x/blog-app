import React from "react"
import { renderToString } from "react-dom/server"

const renderHtml = (title: string, Head: React.FC, Body: React.FC) => (
  <html lang="ja">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css" integrity="sha256-oSrCnRYXvHG31SBifqP2PM1uje7SJUyX0nTwO2RJV54=" crossOrigin="anonymous" />
      <link rel="stylesheet" type="text/css" media="screen" href="/static/layout.css" />
      <link rel="stylesheet" type="text/css" media="screen" href="/static/theme.css" />
      <script src="https://unpkg.com/react@16/umd/react.development.js" crossOrigin="anonymous" />
      <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossOrigin="anonymous" />
      <Head />
    </head>

    <body className="g-flex-column">
      <Body />
    </body>
  </html>
)

export const renderHtmlToString = (title: string, Head: React.FC, Body: React.FC): string =>
  "<!DOCTYPE html>\n" + renderToString(renderHtml(title, Head, Body))

export const AppHead = (user: unknown, data: unknown): React.FC => () => (
  <>
    <script id="login-user-script" type="text/plain" data-json={JSON.stringify(user)} defer />
    <script id="initial-data-script" type="text/plain" data-json={JSON.stringify(data)} defer />
    <script src="/static/bundle.js" defer />
  </>
)

export const AppBody: React.FC = () => (
  <article id="app-container" className="flex-stretch g-flex-column" />
)
