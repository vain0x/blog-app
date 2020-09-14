/**
 * クライアントのページを指し示すもの。
 *
 * リンク先を指定するときに使う。
 */
export type ClientRoute =
  HomeRoute
  | PostsIndexRoute
  | PostsViewRoute
  | PostsAddRoute

export interface HomeRoute {
  pathname: "/home"
}

export const HOME_ROUTE: HomeRoute = {
  pathname: "/home",
}

/** 1-indexed */
type PageNumber = number

export interface PostsIndexRoute {
  pathname: "/posts/"
  query: {
    page: PageNumber
  }
}

export const newPostsIndexRoute = (page: PageNumber): PostsIndexRoute =>
  ({
    pathname: "/posts/",
    query: {
      page,
    },
  })

export const POSTS_INDEX_ROUTE: PostsIndexRoute =
  newPostsIndexRoute(1)

type PostId = number

export interface PostsViewRoute {
  pathname: "/posts/view"
  query: {
    id: PostId
  }
}

export const newPostsViewRoute = (id: PostId): PostsViewRoute =>
  ({
    pathname: "/posts/view",
    query: {
      id,
    },
  })

export interface PostsAddRoute {
  pathname: "/posts/add"
  query?: {
    id?: PostId
  }
}

export const POSTS_ADD_ROUTE: PostsAddRoute = {
  pathname: "/posts/add",
}
