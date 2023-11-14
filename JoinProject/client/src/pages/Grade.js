import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import GradeForTeacher from "../components/GradeForTeacher.js";
import GradeCard from "../components/GradeCard.js";
import * as constant from  "../constant.js"
export default function Grade() {
  const { courseToken } = useParams();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
    
  const [grades, setGrades] = useState({});


  useEffect(() => {
    if (user) {
      fetch(`${constant.URL_API}/grades/get-grade-student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseToken,
          username: user.username,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result)
          setGrades(result)
        })
        .catch((err) => console.log(err));
    }
  }, []);

  
  return (
    <div>
      {grades.length === 0 ? (
        <div className="grades flex flex-col gap-y-2 px-3">Chưa có bảng điểm nào</div>
      ) : (
        <div className="grades flex flex-col gap-y-2 px-3">
          {user.role === "Sinh Viên" && grades.exams && grades.exams.map((ex, index) => (
            <GradeCard key={index} 
            startAt={ex.startAt} endAt={ex.endAt} linkTo={`/exam/${ex.id}`} status={ex.userStatus[0].status} grade={ex.userStatus[0].grade} percent={ex.percent} title={ex.name} />
          ))}

          {user.role === "Sinh Viên" && grades.assignments && grades.assignments.map((assign, index) => (
            <GradeCard key={index} 
            startAt={assign.timeStart} endAt={assign.timeEnd} linkTo={`/assignments/${assign.assignmentToken}`} status={assign.userStatus[0].status} grade={assign.userStatus[0].grade} percent={assign.percent} title={assign.title} />
          ))}

          {user.role !== "Sinh Viên" && <GradeForTeacher courseToken={courseToken}/>}
        </div>
      )}
    </div>
  );
}
