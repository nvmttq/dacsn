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
    
  const [grades, setGrades] = useState([]);


  useEffect(() => {
    if (user) {
      fetch(`${constant.URL_API}/courses/${courseToken}/grade`, {
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
        .then((result) => setGrades(result))
        .catch((err) => console.log(err));
    }
  }, []);

  
  return (
    <div>
      {grades.length === 0 ? (
        <div className="grades flex flex-col gap-y-2 px-3">Chưa có bảng điểm nào</div>
      ) : (
        <div className="grades flex flex-col gap-y-2 px-3">
          {/* {grades.map((grade, index) => (
            <GradeCard key={index} grade={grade} />
          ))} */}
          <GradeForTeacher courseToken={courseToken}/>
        </div>
      )}
    </div>
  );
}
