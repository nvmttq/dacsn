
import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';



// PAGES
import Login from '../pages/Login.js';

export default function MaximizableDemo() {
    const [visible, setVisible] = useState(true);

    return (
        <div className="card flex justify-content-center">
            {/* <Button label="Show" icon="pi pi-external-link" onClick={() => setVisible(true)} /> */}
            <Dialog header="Header" visible={visible} maximizable style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <p className="m-0">
                    <Login/>
                </p>
            </Dialog>
        </div>
    )
}
        