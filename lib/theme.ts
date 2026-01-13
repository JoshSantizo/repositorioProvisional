export type Theme = "dark" | "light" | "blue"

export function getTheme(): Theme {
  if (typeof window !== "undefined") {
    return (localStorage.getItem("theme") as Theme) || "light"
  }
  return "light"
}

export function setTheme(theme: Theme) {
  if (typeof window !== "undefined") {
    localStorage.setItem("theme", theme)
    document.documentElement.classList.remove("dark", "light", "blue")
    document.documentElement.classList.add(theme)
  }
}
