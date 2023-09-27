import React, { useEffect, useState, useContext} from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { AuthContext } from "../context/AuthProvider.js";
import { Link, useParams } from "react-router-dom";



export default function CourseCard() {
  const {token} = useParams();
  const {user} = useContext(AuthContext);
  console.log(token)

  return (
    <div>
        <Link to="/">GO BACK</Link>
        <div>DETAILS COURSE {token}</div>
    </div>
  );
}
