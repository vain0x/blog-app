// テストのエントリーポイント (予定)

// mocha がグローバルに定義するもの
declare global {
  const describe: (body: () => void) => void
  const it: (body: () => void | Promise<void>) => void
}

export default {}
