import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";


export const AuthContext = React.createContext();
function AuthProvider({user, children}) {

  return (
    <AuthContext.Provider value={{user}}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
