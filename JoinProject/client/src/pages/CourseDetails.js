import React from "react";
import { Link, useParams } from "react-router-dom";



export default function CourseCard() {
  const {courseToken} = useParams();
  console.log(courseToken)
  return (
    <div>
        <div><b>DETAILS COURSE:</b> {courseToken}</div>
        {/* <Link to={`./grade`}>
          XEM BANG DIEM
        </Link> */}
        
    </div>
  );
}
