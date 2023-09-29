import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";

function Contents() {
    const [turnButton, setTurnButton] = useState(false);
    return (
        <div className="h-auto w-auto mt-4 ml-10">
            <div className="absolute end-10">
                <Button label="Thêm tài nguyên" style={{ fontSize: 10 }} />
            </div>
            <div className="h-[500px] w-[1000px] bg-white rounded-[15px]">

            </div>
        </div>
    )
}



export default Contents;