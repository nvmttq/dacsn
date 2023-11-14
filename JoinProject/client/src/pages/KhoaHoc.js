import React, { useRef, useState } from "react";

import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";

import FormJoinCourse from "../components/FormJoinCourse.js";
import CourseCard from "../components/CourseCard.js";
import SelectFaculty from "../components/SelectFaculty.js";
import * as constant from  "../constant.js"
import { InputText } from "primereact/inputtext";


function KhoaHoc() {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [visibleCreateCourse, setVisibleCreateCourse] = useState(false);
  const toastCreateCousrse = useRef(null);
  const createNameCourse = useRef('');

  const navigate = useNavigate();

  const showCreateCourse = (data) => {
    console.log(data)
    toastCreateCousrse.current.show({
      severity: data.severity,
      summary: "Thông báo",
      detail: data.msg,
    });
  };

  const handleCreateCourse = async (e) => {
    console.log( createNameCourse.current.value)
    e.preventDefault();
    await fetch(`${constant.URL_API}/courses/create-course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
        nameCourse: createNameCourse.current.value
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        showCreateCourse(result);
        
        setTimeout(() => {navigate("/")}, 2000)
        setVisibleCreateCourse(false);
      })
      .catch((err) => {
        showCreateCourse({
          severity: "error",
          msg: "Có gì đó sai sai. Vui lòng kiểm tra lại !",
        });
      });
  };

  return (
    <div className="courses p-2 mt-5 w-full h-screen flex flex-col">
      <div className="courses-header flex justify-between items-center">
        <span className="font-bold text-secondary text-xl">Các khóa học theo Thời Khóa Biểu</span>
        <div className="join-course flex gap-2">
          <FormJoinCourse
            idInput={"courseToken"}
            nameInput={"courseToken"}
            text={"Nhập mã lớp học"}
            textButton={"Tham gia lớp học"}
          />
          {user && user.role.toUpperCase() !== "SV" && user.role.toUpperCase()  !== "SINH VIÊN" ? (<div className="create-new-course">
      
      <Toast ref={toastCreateCousrse} position="bottom-right"/>
        <Button
            label="Tạo mới"
            icon="pi pi-plus"
            onClick={() => setVisibleCreateCourse(true)}
            className="p-0 px-3 py-1 text-base"
          />
          <Dialog
            header="Tạo khóa học mới"
            visible={visibleCreateCourse}
            style={{ width: "50vw" }}
            onHide={() => setVisibleCreateCourse(false)}
          >
            <form onSubmit={handleCreateCourse}>
              <div className="form-outline mt-7">
                <span className="p-float-label">
                  <InputText
                    ref={createNameCourse}
                    id="nameCourse"
                    className="w-full p-3 outline-none"
                  />
                  <label htmlFor="nameCourse">Tên khóa học</label>
                </span>
              </div>
              <SelectFaculty></SelectFaculty>
              <div className="text-center md:text-left mt-4 pt-2">
                <Button className="btn btn-primary btn-lg px-6 py-1">
                  Tạo
                </Button>
              </div>
            </form>
          </Dialog>
        </div>) : <div></div>}
        </div>
      </div>
      <CourseCard />
    </div>
  );
}

export default KhoaHoc;
