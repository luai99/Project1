import { createContext, useState, useEffect } from "react";
import Cookies from "universal-cookie";

export const User = createContext({});

const cookies = new Cookies();

export default function UserProvider({ children }) {
  const initialToken = cookies.get("Bearer") || "";
  const initialRtoken = cookies.get("Bearer1") || "";

  const [auth, setAuth] = useState({
    token: initialToken,
    Rtoken: initialRtoken,
  });

  useEffect(() => {
    cookies.set("Bearer", auth.token);
    cookies.set("Bearer1", auth.Rtoken);
  }, [auth]);

  return <User.Provider value={{ auth, setAuth }}>{children}</User.Provider>;
}
