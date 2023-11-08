import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import * as constant from "../constant.js"
import axios from "axios";


export default function Attendance() {
    const { courseToken } = useParams();
    const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
    const [temp, setTemp] = useState(null);
    const [temp1, setTemp1] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:3002/courses-getC", {})
            .then(function (res) {
                setTemp(res.data.dataPosts.find(c => c.token === courseToken));
                // console.log(1);
                loadStudent();
                // console.log(temp);
                // console.log(res.data.dataPosts);
            })
            .catch(function (er) {
                console.log(er);
            })
    }, []);

    const loadStudent = () => {
        axios
            .get("http://localhost:3002/courses-atten", {})
            .then(function (res) {
                console.log(res.data.dataPosts.find(c => c.idCourse === courseToken));
                // console.log(temp1);
                // if (temp1 === null) {
                //     axios
                //         .post("http://localhost:3002/courses-atten", {
                //             idCourse: courseToken,
                //             listStudent: temp,
                //         })
                //         .then(function (res) {
                //             console.log(3);
                //         })
                //         .catch(function (er) {
                //             console.log("loi roi");
                //         })
                // }
                // else {

                // }
            })
            .catch(function (er) {
                console.log(er);
            })
    }
    const [atten, setAtten] = useState([]);
    return (
        <>
            <div className="grades flex flex-col gap-y-2 px-3 border-[1px]">
                <div className="card">
                    <DataTable value={atten} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="name" header="Tên học sinh"></Column>
                        <Column field="time" header="Thời gian điểm danh"></Column>
                        <Column field="check" header="Điểm danh"></Column>
                    </DataTable>
                </div>
            </div>
        </>

    );
}
