import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as constant from "../constant.js";

export default function GroupCard() {
  const [groups, setGroups] = useState([]);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  useEffect(() => {
    if (user) {
      fetch(`${constant.URL_API}/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
        }),
      })
        .then((res) => res.json())
        .then((result) => setGroups(result));
    }
  }, []);

  const getToken = ({ token }) => {
    localStorage.setItem("currentGroups", JSON.stringify(token));
  };
  return (
    <>
      {groups.length !== 0 ? (
        <div className="courses-content mt-2 flex flex-wrap gap-5 h-max">
          {groups.map((group, index) => (
            <div
              key={index}
              className="card1 bg-white flex flex-col w-[25%] rounded-md transition duration-300 ease-in-out hover:scale-110 shadow-lg"
            >
              <div className="card-top">
                <img
                  alt="Card"
                  src="https://primefaces.org/cdn/primereact/images/usercard.png"
                  className="w-full h-[100px] flex-shrink"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>

              <div className="card-body p-4 flex flex-col flex-grow">
                <div className="card-title text-lg text-zinc-600 font-bold break-words">
                  {group.title}
                </div>
                <div className="card-content flex justify-between mt-auto pt-3">
                  <div className="course-token flex items-center gap-2">
                    <i className="icon pi pi-key text-icon-color text-xl"></i>
                    <div className="token flex flex-col">
                      <span className="font-bold text-secondary">
                        {group.participants.length}
                      </span>
                      <span className="label">Số thành viên</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer px-4 py-2">
                <Link
                  to={`/groups/${group.token}`}
                  label="Xem nhóm"
                  icon="pi pi-book"
                  onClick={() => getToken({ token: group.token })}
                  className="p-button p-component p-button-link font-medium p-0 underline"
                >
                  Vào nhóm
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center font-bold">BẠN CHƯA THAM GIA NHÓM NÀO</div>
      )}
    </>
  );
}
