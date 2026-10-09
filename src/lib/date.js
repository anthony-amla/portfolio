export const currentYear = () => new Date().getFullYear()

export const yearsSince = (year) => currentYear() - year

/** Share of the current year already elapsed, 0–100. */
export const yearProgress = () => Math.round(((new Date().getMonth() + 1) / 12) * 100)
