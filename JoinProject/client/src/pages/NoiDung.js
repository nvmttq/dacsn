import React from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabMenu } from 'primereact/tabmenu';


function NoiDung() {
    return (
        <div>
            <div style={{
                border: '1px solid red',
                marginTop: 20,
            }}>
                <span className="font-bold"
                    style={{
                        // border: '1px solid red',
                        marginLeft: 20,
                    }}>

                    <text style={{
                        fontSize: 18,
                    }}>
                        Bài tập có sẵn
                    </text>
                </span>
            </div>

            <div className="w-full border-2 h-20 mt-5 ">
                <span className="ml-10 border-2" >
                    <text>
                        môn học:
                    </text>
                    <text className="ml-2">
                        0
                    </text>
                    <text className="ml-10">
                        Lọc theo:
                    </text>
                    <select name="Sort" id="Sort" className="ml-1 h-8 text-xs rounded-lg">
                        <option value="volvo" >Volvo</option>
                        <option value="saab">Saab</option>
                        <option value="mercedes">Mercedes</option>
                        <option value="audi">Audi</option>
                    </select>
                </span>
                <div className="rounded-lg w-1/2 h-10 mt-5 bg-white flex justify-center ">
                
                </div>
            </div>
            <button className=" bg-sky-500  text-white text-xs px-4 py-2 mt-20 mr-20 rounded hover:bg-blue-600  absolute right-0">
                <text className="font-bold color-white">Thêm tài nguyên</text>
            </button>
        </div>
    )
}

export default NoiDung;