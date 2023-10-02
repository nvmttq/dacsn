import React, { useRef, useState } from "react";

import FormJoinCourse from "../components/FormJoinCourse.js";
import GroupCard from "../components/GroupCard.js";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

function Nhom() {
  const [visible, setVisible] = useState(false);
  const createNameGroup = useRef();
  const handleCreateGroup = (e) => {
    e.preventDefault();
  };
  
  return (
    <div className="courses p-2 w-full flex flex-col">
      <div className="courses-header flex justify-between items-center">
        <span className="font-bold text-white">Các nhóm đã tham gia</span>
        <div className="join-course flex items-center gap-2">
          <FormJoinCourse
            idInput={"groupToken"}
            nameInput={"groupToken"}
            text={"Nhập mã nhóm"}
            textButton={"Tham gia nhóm"}
          />
          <Button
            label="Tạo mới"
            icon="pi pi-plus"
            onClick={() => setVisible(true)}
            className="p-0 px-3 py-1 text-base"
          />
          <Dialog
            header="Tạo nhóm mới"
            visible={visible}
            style={{ width: "50vw" }}
            onHide={() => setVisible(false)}
          >
            <form onSubmit={handleCreateGroup}>
              <div className="form-outline mt-7">
                <span className="p-float-label">
                  <InputText
                    id="nameGroup"
                    onChange={(e) => (createNameGroup.current = e.target.value)}
                    className="w-full p-3 outline-none"
                  />
                  <label htmlFor="nameGroup">Tên nhóm</label>
                </span>
              </div>

              <div className="text-center md:text-left mt-4 pt-2">
                <Button className="btn btn-primary btn-lg px-6 py-1">
                  Tạo
                </Button>
              </div>
            </form>
          </Dialog>
        </div>
      </div>
      <GroupCard />
    </div>
  );
}

export default Nhom;
