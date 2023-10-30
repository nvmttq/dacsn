import React, { useEffect, useRef, useState } from "react";
import * as constant from "../constant.js"
import moment from "moment"

import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { ListBox } from 'primereact/listbox';

import MoodIcon from "@mui/icons-material/Mood";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";



function Chat() {
    const username = "123";
    const dataMessage = [
        {
            isOwn: '123',
            text: "chào em",
            avatar: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp",
        },
        {
            isOwn: "234",
            text: "chào cặc",
            avatar: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp",
        }
    ];

    const [selectedCity, setSelectedCity] = useState(null);
    const cities = [
        { name: 'Nguyễn Minh Thắng', code: 'NY' },
        { name: 'Nguyễn Văn Minh', code: 'RM' },
        { name: 'Nguyễn Quốc Dũng', code: 'LDN' },
        { name: 'Nguyễn Tấn Tài', code: 'IST' },
    ];

    const [arrayChat, setArrayChat] = useState([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        fetch(`${constant.URL_API}/groups/`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => setArrayChat(result));
        console.log(arrayChat);
    }, []);


    return (
        <>
            <div className="flex flex-row">
                <div>
                    <div className="chat-message bg-blue-500 mt-[10px] w-[1000px] ml-[20px] h-[600px]"
                        style={{ overflowY: "scroll" }}
                    >

                        <div className="flex flex-row justify-end">
                            <div>
                                <p className="small p-2 me-3 mb-1 rounded-lg bg-[#3B71CA] text-white">
                                    chào em
                                </p>
                                <p className="text-sm me-3 mb-3 rounded-lg text-gray-500">
                                    time: 123
                                </p>
                            </div>
                            <img
                                src="https://scontent.fsgn5-8.fna.fbcdn.net/v/t39.30808-1/375600318_1363743777510662_419034021746548421_n.jpg?stp=dst-jpg_p320x320&_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=ih6rPyfFGhMAX9kLnum&_nc_ht=scontent.fsgn5-8.fna&oh=00_AfAuSsgZOF-ZdU1l6rZ6V0LRnj23kgtNNIqnhqA7rYoUMQ&oe=653EFD73"
                                alt="avatar 1"
                                style={{ width: "40px", height: "100%" }}
                                className="w-11 h-full"
                            />
                        </div>

                        <div className="flex flex-row justify-start">
                            <img
                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                alt="avatar 1"
                                style={{ width: "40px", height: "100%" }}
                                className="w-11 h-full"
                            />
                            <div>
                                <p className="small p-2 me-3 mb-1 rounded-lg bg-[#F5F6F7]">
                                    chào cặc
                                </p>
                                <p className="text-sm me-3 mb-3 rounded-lg text-gray-500">
                                    time: 234
                                </p>
                            </div>
                        </div>

                    </div>
                    {/* gửi tin nhắn */}
                    <form className="send-chat ml-[20px] w-[1000px]" > 
                        <div className=" text-gray-500 flex justify-start items-center pe-3 pt-3 gap-2">
                            <img
                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                alt="avatar 3"
                                style={{ width: "30px", height: "100%" }}
                                className="w-10 h-full"
                            />
                            <input
                                type="text"
                                id="exampleFormControlInput2"
                                placeholder="Soạn tin"
                                className="text-md outline-none w-[870px] h-[40px]"
                                autoComplete="false"
                            />

                            <FileUpload
                                mode="basic"
                                name="demo[]"
                                url="/api/upload"
                                accept="image/*"
                                maxFileSize={1000000}
                                chooseOptions={{
                                    icon: <AttachFileIcon />,
                                    className: "p-0",
                                }}
                                chooseLabel=" "
                            />
                            <MoodIcon style={{ fontSize: "20px" }} />
                            <SendIcon style={{ color: "#1976D2", fontSize: "20px" }} />
                        </div>
                    </form>
                </div>
                <div className="card flex flex-col font-semibold">
                    <p className="text-[20px] flex justify-center">Thành viên trong nhóm</p>
                    <ListBox filter value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name" className="w-full md:w-14rem" />
                </div>
            </div>

        </>

    );
}

export default Chat;
