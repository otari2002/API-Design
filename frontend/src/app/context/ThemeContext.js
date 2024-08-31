'use client'
import { useContext, createContext, useState } from "react";

export const ThemeContext = createContext();

const ThemeProvider = ({children}) =>{
  const [theme, setTheme] = useState({
    strong : "#84029D",
    light : "#f25dc5",
    accordion : {
      position: "sticky",
      top: 0,
      background: "white",
      zIndex: 1,
      borderBottom: "1px solid lightgray",
      _hover: {
        background: "white"
      }
    }
  });
  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () =>{
  const val = useContext(ThemeContext);
  if(val === undefined) throw new Error("Context is undefined")
  return val;
}

export default ThemeProvider;