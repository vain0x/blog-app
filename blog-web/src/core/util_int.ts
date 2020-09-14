export const toInt = (value: unknown): number | null => {
  switch (typeof value) {
    case "number":
      return numberToInt(value)

    case "string":
      return numberToInt(Number.parseFloat(value))

    default:
      return null
  }
}

const numberToInt = (value: number): number | null =>
  Number.isFinite(value) ? Math.round(value) : null
