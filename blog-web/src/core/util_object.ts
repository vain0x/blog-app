/**
 * 値の型が不明なオブジェクト
 *
 * null ではないので、`obj[key]` の形で要素にアクセスできる。
 */
export interface UnknownObject {
  [key: string]: unknown
}

/**
 * 型の不明な値をオブジェクトにキャストする。(不可能なら null)
 */
export const unknownAsObject = (value: unknown): UnknownObject | null =>
  typeof value === "object" ? value as UnknownObject | null : null
