import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

// PAGES
import MenuSidebar from "./components/MenuSidebar.js";
import KhoaHoc from "./pages/KhoaHoc.js";
import Lich from "./pages/Lich.js";
import Nhom from "./pages/Nhom.js";
import CourseDetails from "./pages/CourseDetails.js";
import Grade from "./pages/Grade.js";

import Meeting from "./pages/Meeting.js";
import NoiDung from "./pages/NoiDung.js";


function App() {


  return (
    <>
      <div className="w-screen h-screen flex">
        <div className="w-1/6">
          <MenuSidebar />
        </div>
        <div className="w-5/6 bg-red-300">
          <Routes>
            <Route path="/" element={<KhoaHoc />}></Route>
            <Route path="/courses/:courseToken" element={<CourseDetails />} />
            <Route
              path="/courses/:courseToken/grade"
              element={<Grade />}
            ></Route>

            <Route path="/groups" element={<Nhom />} />
            <Route path="/lich" element={<Lich />} />
            <Route path="/content" element={<NoiDung />} />

            <Route path="/meeting" element={<Meeting />}></Route>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
