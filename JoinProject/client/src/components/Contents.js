import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";

function Contents() {
    const [turnButton, setTurnButton] = useState(false);
    return (
        <>
            <button className=" bg-sky-500  text-white text-xs px-4 py-2 mt-20 mr-20 rounded hover:bg-blue-600  absolute right-0">
                <text className="font-bold color-white">Thêm tài nguyên</text>
            </button>
        </>


    )
}



export default Contents;