import React from "react";
import { Link, useParams } from "react-router-dom";



export default function CourseCard() {
  const {courseToken} = useParams();
  console.log(courseToken)

  return (
    <div>
        <Link to="/">GO BACK</Link>
        <div>DETAILS COURSE {courseToken}</div>
        <Link to={`/courses/${courseToken}/grade`}>
          XEM BANG DIEM
        </Link>

        
    </div>
  );
}
