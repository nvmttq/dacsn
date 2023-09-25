import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

export default function GroupCard() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3002/groups", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((result) => setGroups(result));
  }, []);

  const header = (
    <img
      alt="Card"
      src="https://primefaces.org/cdn/primereact/images/usercard.png"
    />
  );
  const footer = (
    <div className="">
      <Button label="Xem nhóm" icon="pi pi-book" />
    </div>
  );

  return (
    <>
      {groups.length !== 0 ? (
        <div
          className="courses-content flex flex-wrap justify-center gap-2 mt-2 h-[calc(100vh-34px-25px)] bg-lime-200"
          style={{ overflowY: "scroll" }}
        >
          {groups.map((group, index) => (
            <Card
              key={index}
              title={group.title}
              footer={footer}
              header={header}
              className="w-[calc(33.333333%-16px)]"
            >
              <div className="m-0">
                <div className="course-info flex justify-between">
                  
                  <div className="course-assigment flex items-center gap-2">
                    <i className="pi pi-book text-green-600 text-xl" />
                    <div className="flex flex-col">
                      <span className="font-bold">{group.participants.length}</span>
                      <span className="label">Số thành viên</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center font-bold">
          BẠN CHƯA THAM GIA NHÓM NÀO
        </div>
      )}
    </>
  );
}
