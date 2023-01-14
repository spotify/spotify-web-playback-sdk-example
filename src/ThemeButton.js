import React, {useContext} from "react"
import {ThemeContext} from "./themeContext"

function ThemeButton(props) {
    const {theme, toggleTheme} = useContext(ThemeContext)

    
      const buttonStyle =  theme == "light" ? "light-button" : "dark-button"
    

    return (
        <button 
            //onClick={toggleTheme} 
            onClick = {props.handleClick}
            className={buttonStyle}
        >
            {props.text}
        </button>
    )    
}

export default ThemeButton