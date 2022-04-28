import Cookies from "js-cookie";
import { useReducer, useEffect } from "react";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from "next/router";

import { socialApi } from "../../api";
import { AuthContext, authReducer } from "./";

const AUTH_INITIAL_STATE = {
  isLoggedIn: false,
  user: undefined,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const { data, status } = useSession();

  useEffect(() => {
    if ( status === 'authenticated') {

      Cookies.set("token", data.user.token);

      dispatch({ type: "[Auth] - Login", payload: data.user});
    }
  }, [status, data])

  const logout = () => {
    signOut();
  }

  const loginUser = async (username, password) => {
    try {
      const { data } = await socialApi.post("/auth/signIn", {
        username,
        password,
      });

      const {
        data: { token }
      } = data;

      Cookies.set("token", token);
      Cookies.set("user", JSON.stringify(data.data));

      dispatch({ type: "[Auth] - Login", payload: data.data });

      return true;
    } catch (error) {
      return false;
    }
  };
  
  return (
    <AuthContext.Provider value={{ ...state, loginUser }}>
      {children}
    </AuthContext.Provider>
  );
};
