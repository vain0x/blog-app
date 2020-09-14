/**
 * 場合分けが網羅されたことを宣言する。(網羅されていなければコンパイルエラーになる。)
 */
export const exhaust = (value: never, err?: Error): never => {
  console.error("EXHAUST", value)
  throw err ?? new Error("EXHAUST")
}

export const checkExhaustive = (_: never): void => {
  // Pass.
}
