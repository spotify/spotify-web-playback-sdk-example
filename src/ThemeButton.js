import React, {useContext} from "react"
import {ThemeContext} from "./themeContext"

function ThemeButton(props) {
    const {theme, toggleTheme} = useContext(ThemeContext)

    
      const buttonStyle =  theme == "light" ? "light-button" : "dark-button"
    

    return (
        <button 
            onClick={toggleTheme} 
            className={buttonStyle}
        >
            Switch Theme
        </button>
    )    
}

export default ThemeButton