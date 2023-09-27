import React, { useState } from "react";
import { TabMenu } from 'primereact/tabmenu';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';


function NoiDung() {
    const [activeIndex, setActiveIndex] = useState(3);
    const items = [
        { label: 'Nội dung', icon: 'pi pi-fw pi-book' },
        { label: 'Diễn đàn', icon: 'pi pi-fw pi-comments' },
        { label: 'Cuộc họp', icon: 'pi pi-fw pi-phone' },
        { label: 'bảng điểm', icon: 'pi pi-fw pi-file' },
        { label: 'Điểm danh', icon: 'pi pi-fw pi-check' }
    ];

    const [selectedCity, setSelectedCity] = useState(null);
    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    return (
        <div>
            <div style={{
                // border: '1px solid red',
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

            <div className="w-full h-auto mt-5 ">
                <span className="ml-10 w-auto" >
                    <text>
                        môn học:
                    </text>
                    <text className="ml-2">
                        0
                    </text>

                    <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name"
                        placeholder="Lọc theo" className="ml-10 text-xs/[0.2] w-auto md:w-14rem" />
                </span>
                <div className="rounded-lg w-1/2 h-auto mt-5 ml-10 bg-white flex justify-center ">
                    <TabMenu className="text-xs" model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                </div>
            </div>
            <button className=" bg-sky-500  text-white text-xs px-4 py-2 mt-20 mr-20 rounded hover:bg-blue-600  absolute right-0">
                <text className="font-bold color-white">Thêm tài nguyên</text>
            </button>
        </div>
    )
}

export default NoiDung;