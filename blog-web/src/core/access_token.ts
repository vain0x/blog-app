declare const IS_ACCESS_TOKEN: unique symbol

export type AccessToken = string & { [IS_ACCESS_TOKEN]: true }
