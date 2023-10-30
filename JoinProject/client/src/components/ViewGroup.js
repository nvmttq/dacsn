import React, { useEffect, useState } from "react";
import * as constant from "../constant.js"
import { Link, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import ChatMessage from "./ChatMessage.js";
import Chat from "./Chat.js"
import ChatSidebar1 from "./ChatSidebar1.js";
import Assignments from "../pages/Assignments.js"
export default function GroupCard() {
    // const { groupToken } = useParams();
    // console.log(groupToken);

    const [type, setType] = useState(0);

    return (
        <>
            <div className="ml-[25px] mt-[10px]">
                <span className="">
                    <Button
                        label="Chat nhóm"
                        onClick={() => setType(0)}
                        className="p-0 px-3 py-1 text-base"
                    />
                    <Button
                        label="Bài tập"
                        onClick={() => setType(1)}
                        className="p-0 px-3 py-1 text-base ml-[25px]"
                    />
                </span>
                <div>
                    {type === 0 && <Chat />}
                    {type === 1 && <Assignments />}
                </div>
            </div>
        </>
    )
}