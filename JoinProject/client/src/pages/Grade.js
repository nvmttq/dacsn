import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
      DAY LA BANG DIEM CUA BAN TRONG KHOA HOC
      <span>TAT CA DIEM CUA CAC BAI TAP</span>
      {grades.length === 0 ? (
        <div className="grades flex flex-col gap-y-2 overflow-y-scroll h-full px-3"></div>
      ) : (
        <div className="grades flex flex-col gap-y-2 overflow-y-scroll h-full px-3">
          {grades.map((grade, index) => (
            <GradeCard key={index} grade={grade} />
          ))}
        </div>
      )}
    </div>
  );
}
