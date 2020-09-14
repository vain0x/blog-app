// 参考:
// Web API https://developer.mozilla.org/ja/docs/Web/API/URL_API
// Node.js https://nodejs.org/docs/latest-v10.x/api/url.html#url_url_strings_and_url_objects

export type UrlQuery = Record<string, string | number | boolean>

export interface UrlPath {
  pathname: string
  query?: UrlQuery
  fragment?: string
}

const DUMMY_ORIGIN = "http://localhost"

const iterableIsEmpty = (iterable: Iterable<unknown>): boolean =>
  iterable[Symbol.iterator]().next().done === true

export const urlPathFromString = (url: string): UrlPath => {
  const { pathname, hash: fragment, searchParams } = new URL(url, DUMMY_ORIGIN)

  const path: UrlPath = { pathname }
  if (!iterableIsEmpty(searchParams)) {
    // TODO: Object.fromEntries
    const obj: UrlQuery = {}
    for (const [key, value] of searchParams) {
      Object.defineProperty(obj, key, { enumerable: true, value })
    }

    path.query = obj
  }
  if (fragment.startsWith("#")) {
    path.fragment = decodeURIComponent(fragment.slice(1))
  }

  return path
}

export const urlPathToString = (path: UrlPath): string => {
  const url = new URL(path.pathname, DUMMY_ORIGIN)

  if (path.query != null) {
    url.search = new URLSearchParams(path.query as unknown as Record<string, string>).toString()
  }
  if (path.fragment != null) {
    url.hash = "#" + path.fragment
  }

  return url.toString().slice(DUMMY_ORIGIN.length)
}
