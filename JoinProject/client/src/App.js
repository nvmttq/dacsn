import React, { useState } from "react";
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
import EditExam from "./components/EditExam.js";
import ViewGroup from "./components/ViewGroup.js";
import AssignmentForTeacher from "./components/AssignmentForTeacher.js"
import Test from "./pages/Test.js";
import Repository from "./pages/Repository.js";
function App() {
  const [idReview, setIdReview] = useState("");
  return (
    <>
      <div className="w-full h-screen flex">
        <div className="w-1/6 fixed left-0 h-screen bg-white">
          <MenuSidebar />
        </div>
        <div className="pl-[calc(16.6667%+20px)] pr-4 w-full bg-[#F5F5F6] h-max">
          <Routes>
            <Route path="/" element={<KhoaHoc />}></Route>
            <Route path="/courses/:courseToken" element={<NoiDung />} />
            <Route path="/test" element={<Test />} />
            <Route
              path="/exam/:examToken"
              element={<IndexExam setIdReview={setIdReview} />}
            ></Route>
            <Route path="/groups/:groupToken" element={<ViewGroup />}>
              {" "}
            </Route>

            <Route
              path="/assignments/:assignToken"
              element={<AssignmentForTeacher />}
            ></Route>

            <Route
              path="/exam/review/:examToken"
              element={<ReviewExam idReview={idReview} />}
            ></Route>

            <Route
              path="/exam/redo/:examToken"
              element={<Exam />}
            ></Route>
            <Route
              path="/exam/start/:examToken"
              element={<Exam />}
            ></Route>
            <Route path="/exam/redo/:examToken" element={<Exam />}></Route>
            <Route path="/exam/start/:examToken" element={<Exam />}></Route>
            <Route path="/exam/edit/:examToken" element={<EditExam />}></Route>

            <Route path="/groups" element={<Nhom />} />
            <Route path="/lich" element={<Lich />} />
            <Route path="/repositories" element={<Repository/>}></Route>
          
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
