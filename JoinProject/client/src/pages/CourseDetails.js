import React from "react";
import { Link, useParams } from "react-router-dom";



export default function CourseCard() {
  const {courseToken} = useParams();
  console.log(courseToken)
  const examToken = "examToken1";
  return (
    <div>
        <Link to="/">GO BACK</Link>
        <div>DETAILS COURSE {courseToken}</div>
        <Link to={`./grade`}>
          XEM BANG DIEM
        </Link>
      <Link to={`/exam/${examToken}`}>GO TO EXAM</Link>
        
    </div>
  );
}
