
import React, { useState } from "react";
import { Dropdown } from 'primereact/dropdown';

export default function SelectFaculty() {
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const countries = [
        { name: 'Khoa - Viện Kỹ Thuật Công Nghệ', code: 'AU' },
        { name: 'Viện Phát Triển Ứng Dụng', code: 'BR' },
        { name: 'Khoa sư phạm', code: 'CN' },
        { name: 'Khoa Kinh Tế', code: 'EG' },
    ];

    const selectedFacultyTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <img alt={option.name} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px' }} />
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const facultyOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <img alt={option.name} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px' }} />
                <div>{option.name}</div>
            </div>
        );
    };

    return (
        <div className="card flex justify-content-center">
            <Dropdown value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.value)} options={countries} optionLabel="name" placeholder="Chọn khoa" 
                filter valueTemplate={selectedFacultyTemplate} itemTemplate={facultyOptionTemplate} className="w-full md:w-14rem" />
        </div>    
    )
}
        