import React, { useRef, useState } from "react";

import FormJoinCourse from "../components/FormJoinCourse.js";
import GroupCard from "../components/GroupCard.js";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import * as constant from "../constant.js"
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

function Nhom() {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [visible, setVisible] = useState(false);
  const createNameGroup = useRef('');
  const toastCreateGroup = useRef(null);
  const navigate = useNavigate();

  const showCreateGroup = (data) => {
    toastCreateGroup.current.show({
      severity: data.severity,
      summary: "Thông báo",
      detail: data.msg,
    });
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    console.log(createNameGroup.current.value)
    await fetch(`${constant.URL_API}/groups/create-group`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
        nameGroup: createNameGroup.current.value
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        showCreateGroup(result);
        setTimeout(() => { navigate("/") }, 2000)
      })
      .catch((err) => {
        showCreateGroup({
          severity: "error",
          msg: "Có gì đó sai sai. Vui lòng kiểm tra lại !",
        });
      });
  }


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
          <Toast ref={toastCreateGroup} position="bottom-right" />
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
            <form>
              <div className="form-outline mt-7">
                <span className="p-float-label">
                  <InputText
                    id="nameGroup"
                    ref={createNameGroup}
                    // onChange={(e) => (createNameGroup.current = e.target.value)}
                    className="w-full p-3 outline-none"
                  />
                  <label htmlFor="nameGroup">Tên nhóm</label>
                </span>
              </div>

              <div className="text-center md:text-left mt-4 pt-2">
                <Button className="btn btn-primary btn-lg px-6 py-1" onClick={handleCreateGroup} >
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
