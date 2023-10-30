import React, { useEffect, useState, useRef } from "react";
import { ToggleButton } from 'primereact/togglebutton';
import { ListBox } from 'primereact/listbox';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { PrimeIcons } from 'primereact/api';

export default function Assignments() {

    const [checked, setChecked] = useState(false);// kiểm tra bài đã nộp chưa
    const [selectedCity, setSelectedCity] = useState(null);
    const toast = useRef(null);

    const cities = [
        { name: 'Nguyễn Minh Thắng', code: 'NY' },
        { name: 'Nguyễn Văn Minh', code: 'RM' },
        { name: 'Nguyễn Quốc Dũng', code: 'LDN' },
        { name: 'Nguyễn Tấn Tài', code: 'IST' },
    ];

    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };


    return (
        <>

            <div className=" mt-[15px] h-[650px] flex flex-row ml-[20px]">

                <div className=" w-[400px] mt-[30px]">
                    <p className="font-medium text-xl">Tên bài tập: </p>
                    <p className="font-extralight mt-[10px]">Hạn nộp bài đến </p>
                    <p className="font-extralight mt-[20px]">Chọn tệp nộp bài </p>

                    <Toast ref={toast}></Toast>
                    <FileUpload mode="basic"
                        name="demo[]"
                        url="/api/upload"
                        accept="*" // chấp nhận tất cả file
                        maxFileSize={1000000}
                        onUpload={onUpload}
                        multiple // chọn nhiều file
                        chooseOptions={{
                            icon: ' pi pi-paperclip'
                        }}
                        auto chooseLabel="Đính kèm file"
                        className="mt-[5px] h-[5px] text-sm" />
                </div>

                <div className=" w-[300px] mt-[30px]">
                    <p className="font-normal decoration-[#c4c4c4]">Điểm </p>
                </div>

                <div className=" w-auto mt-[30px] ">

                    <div className="card flex justify-content-center w-[300px]">
                        <ToggleButton onLabel="Đã nộp" offLabel="Chưa nộp" onIcon="pi pi-check" offIcon="pi pi-times"
                            checked={checked} onChange={(e) => setChecked(e.value)} className="w-9rem decoration-[#61b3ff]" />

                    </div>

                </div>

                <div>
                    <div className="card flex flex-col font-semibold">
                        <p className="text-[20px] flex justify-center">Học sinh đã nộp bài</p>
                        <ListBox filter value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name" className="w-full md:w-14rem" />
                    </div>
                </div>
            </div>

        </>
    )

}