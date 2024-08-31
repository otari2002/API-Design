'use client'
import { getSession } from "@/lib/auth";
import { createContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({children}) =>{
  const [user, setUser] = useState(-1);
  
  const fetchUser = async () => {
    const session = await getSession();
    setUser(session);
  };

  return (
    <UserContext.Provider value={{user, fetchUser}}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider;