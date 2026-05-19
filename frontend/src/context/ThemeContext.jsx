import {
  createContext,
  useEffect,
  useState
} from "react"

export const ThemeContext = createContext()

function ThemeProvider({ children }) {

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  )

  function toggleTheme() {

    setTheme(prev =>
      prev === "dark"
        ? "light"
        : "dark"
    )

  }

  useEffect(() => {

    document.documentElement.setAttribute(
      "data-theme",
      theme
    )

    localStorage.setItem(
      "theme",
      theme
    )

  }, [theme])

  return (

    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme
      }}
    >

      {children}

    </ThemeContext.Provider>

  )
}

export default ThemeProvider