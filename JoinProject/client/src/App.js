import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// PAGES
import MenuSidebar from "./components/MenuSidebar.js";
import KhoaHoc from "./pages/KhoaHoc.js";
import Lich from "./pages/Lich.js";
import Nhom from "./pages/Nhom.js";
import Login from "./pages/Login.js";
import PageRender from "./PageRender.js";

//CONTEXT
import AuthProvider from "./context/AuthProvider.js";

//COMPONETS



function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <div className="w-screen h-screen flex">
        <div className="w-1/6 bg-[#222222]">
          <MenuSidebar user={user} setUser={setUser} />
        </div>
        <AuthProvider user={user}>
          <div className="w-5/6 bg-red-300">
            <Routes>
              <Route path="/" element={<KhoaHoc/>} />
              <Route path="/groups" element={<Nhom/>} />
              <Route path="/lich" element={<Lich/>} />
            </Routes>
          </div>
        </AuthProvider>
      </div>
    </>
  );
}

export default App;
