
import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';

export default function MenuUser({e}) {
    const menu = useRef(null);
    const items = [
        {
            label: 'File',
            icon: 'pi pi-fw pi-file',
            
        },
        {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
        },
        {
            label: 'Users',
            icon: 'pi pi-fw pi-user',
           
        },
        {
            label: 'Events',
            icon: 'pi pi-fw pi-calendar',
            
        },
        {
            separator: true
        },
        {
            label: 'Đăng xuất',
            icon: 'pi pi-fw pi-power-off'
        }
    ];

    return (
        <div className="card flex justify-content-center">
            <TieredMenu model={items} popup ref={menu} breakpoint="767px" />
            <Button label="Show" icon="pi pi-bars" onClick={(e) => menu.current.toggle(e)} />
        </div>
    )
}
        