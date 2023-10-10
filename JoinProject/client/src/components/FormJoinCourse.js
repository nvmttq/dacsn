import React, { useRef, useState } from "react";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";


import * as constant from  "../constant.js"


export default function FormikDoc({ idInput, nameInput, text, textButton }) {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;


  const inputToken = useRef("");
  const toast = useRef(null);


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
      
    </div>
  );
}
