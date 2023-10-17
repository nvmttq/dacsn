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
import ReviewExam from "./pages/ReviewExam.js";
import Exam from "./pages/Exam.js";
function App() {
  return (
    <>
      <div className="w-screen h-screen flex">
        <div className="w-1/6 fixed left-0 h-screen bg-white">
          <MenuSidebar />
        </div>
        <div className="pl-[226px] w-full bg-[#F5F5F6] ">
          <Routes>
            <Route path="/" element={<KhoaHoc />}></Route>
            <Route path="/courses/:courseToken" element={<CourseDetails />} />
            <Route
              path="/courses/:courseToken/grade"
              element={<Grade />}
            ></Route>

            <Route
              path="/exam/:examToken"
              element={<Exam />}
            ></Route>
            <Route
              path="/exam/review/:examToken"
              element={<ReviewExam />}
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
