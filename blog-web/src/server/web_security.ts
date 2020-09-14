import express from "express"

export const appendHttpHeadersForSecurity: express.RequestHandler = (_req, res, next) => {
  // セキュリティ: クリックジャッキング対策
  res.header("X-Frame-Options", "SAMEORIGIN")

  // セキュリティ: XSS 対策
  res.header("X-Content-Type-Options", "nosniff")
  res.header("X-XSS-Protection", "1; mode=block")

  next()
}
