import React, { useRef, useState } from "react";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import * as constant from  "../constant.js"
import { Dialog } from "primereact/dialog";

export default function FormikDoc({ idInput, nameInput, text, textButton }) {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const [visibleCreateCourse, setVisibleCreateCourse] = useState(false);

  const inputToken = useRef("");
  const toast = useRef(null);
  const createNameCourse = useRef();

  const navigate = useNavigate();
  const show = (data) => {
    console.log(data)
    toast.current.show({
      severity: data.severity,
      summary: "Thông báo",
      detail: data.msg,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${constant.URL_API}/courses/joinCourse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
        courseToken: inputToken.current.value,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        show(result);
        setTimeout(() => {navigate("/")}, 2000)
      })
      .catch((err) => {
        show({
          severity: "error",
          msg: "Có gì đó sai sai. Vui lòng kiểm tra lại !",
        });
      });
  };

  const handleCreateCourse = (e) => {
    e.preventDefault();
  };

  return (
    <div className="card flex justify-content-center gap-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <span className="p-float-label">
          <Toast ref={toast} position="bottom-right"/>
          <InputText
            id={idInput}
            name={nameInput}
            ref={inputToken}
            className="p-0 px-3 py-1"
          />
          <label htmlFor="input_value" className="text-base">
            {text}
          </label>
        </span>
        <Button label={textButton} className="p-0 px-3 py-1 text-base" />

        
      </form>
      {user && user.role !== "SV" && user.role !== "SINH VIÊN" ? (<div className="create-new-course">
        <Button
            label="Tạo mới"
            icon="pi pi-plus"
            onClick={() => setVisibleCreateCourse(true)}
            className="p-0 px-3 py-1 text-base"
          />
          <Dialog
            header="Tạo nhóm mới"
            visible={visibleCreateCourse}
            style={{ width: "50vw" }}
            onHide={() => setVisibleCreateCourse(false)}
          >
            <form onSubmit={handleCreateCourse}>
              <div className="form-outline mt-7">
                <span className="p-float-label">
                  <InputText
                    id="nameGroup"
                    onChange={(e) => (createNameCourse.current = e.target.value)}
                    className="w-full p-3 outline-none"
                  />
                  <label htmlFor="nameGroup">Tên khóa học</label>
                </span>
              </div>

              <div className="text-center md:text-left mt-4 pt-2">
                <Button className="btn btn-primary btn-lg px-6 py-1">
                  Tạo
                </Button>
              </div>
            </form>
          </Dialog>
        </div>) : <div></div>}
    </div>
  );
}
