import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

// PAGES
import MenuSidebar from "./components/MenuSidebar.js";
import KhoaHoc from "./pages/KhoaHoc.js";
import Lich from "./pages/Lich.js";
import Nhom from "./pages/Nhom.js";
import NoiDung from "./pages/NoiDung.js";
import ReviewExam from "./pages/ReviewExam.js";
import IndexExam from "./pages/IndexExam.js";
import Exam from "./pages/Exam.js";
import ViewGroup from "./components/ViewGroup.js"

function App() {
  return (
    <>
      <div className="w-full h-screen flex">
        <div className="w-1/6 fixed left-0 h-screen bg-white">
          <MenuSidebar />
        </div>
        <div className="pl-[234px] pr-4 w-full bg-[#F5F5F6] h-max">
          <Routes>
            <Route path="/" element={<KhoaHoc />}></Route>
            <Route path="/courses/:courseToken" element={<NoiDung />} />

            <Route
              path="/exam/:examToken"
              element={<IndexExam />}
            ></Route>
            <Route path="/groups/:tokenGroup" element={<ViewGroup />} />
            <Route
              path="/exam/review/:examToken"
              element={<ReviewExam />}
            ></Route>
            <Route
              path="/exam/redo/:examToken"
              element={<Exam />}
            ></Route>
            <Route
              path="/exam/start/:examToken"
              element={<Exam />}
            ></Route>

            <Route path="/groups" element={<Nhom />} />
            <Route path="/lich" element={<Lich />} />

          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
