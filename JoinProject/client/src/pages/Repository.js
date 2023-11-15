import React, { useEffect, useRef, useState } from "react";

import * as constant from "../constant.js";
import { Link } from "react-router-dom";
function Repository() {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    setRepositories(user.repositories);
  }, []);
  return (
    <div className="list-repository mt-5 h-screen">
      {repositories.map((r, i) => (
        <div key={i} className="reposi">
          <div className="name-reposi text-secondary text-xl font-bold">{r.name}</div>
          <div className="sub-reposi">
            {r.data && r && r.data.map((sub, i) => <div key={i} className="flex justify-between ml-4">
                <span className="sub-name">{sub.title}</span>
                <Link to={"/test"} className="underline">dowload</Link>
                
            </div>)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Repository;
