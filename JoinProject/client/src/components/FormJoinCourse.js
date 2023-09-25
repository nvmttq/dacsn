
import React, { useRef, useState } from "react";

import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';


export default function FormikDoc({idInput, nameInput, text, textButton}) {

    const [valInput, setValInput] = useState('');
    const toast = useRef(null);

    const show = () => {
        toast.current.show({ severity: 'success', summary: 'Form Submitted', detail: valInput });
    };
    const handleSubmit = (e) => {
        show();
    }
    

    return (
        <div className="card flex justify-content-center">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <span className="p-float-label">
                    <Toast ref={toast} />
                    <InputText
                        id={idInput}
                        name={nameInput}
                        value={valInput}
                        onChange={(e) => {
                            setValInput(e.target.value);
                        }}
                        className="p-0 px-3 py-1"
                    />
                    <label htmlFor="input_value" className="text-base">{text}</label>
                </span>
                <Button label={textButton} className="p-0 px-3 py-1 text-base" />
            </form>
        </div>
    )
}
        