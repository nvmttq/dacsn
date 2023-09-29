import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

import GradeCard from "../components/GradeCard.js";

export default function Grade() {
  const { courseToken } = useParams();
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
    
  const [grades, setGrades] = useState([]);
  console.log(grades);

  useEffect(() => {
    console.log(user);
    if (user) {
      fetch(`http://localhost:3002/courses/${courseToken}/grade`, {
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
