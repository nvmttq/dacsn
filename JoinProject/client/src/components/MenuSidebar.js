import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { TieredMenu } from "primereact/tieredmenu";

// PAGES
import Login from "../pages/Login.js";
import MenuItemSidebar from "./MenuItemSidebar.js";

export default function MenuSidebar() {

  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState(1);
  const [visible, setVisible] = useState(false);
  const menuUser = useRef(null);
  let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  console.log(activeMenuItem);

  let items = [
    {
      id: 1,
      label: "Khóa học",
      icon: "pi pi-fw pi-book",
      template: (item, options) => {
        return (
          <MenuItemSidebar linkTo={"/"} item={item} options={options} isActiveMenu={activeMenuItem} setActiveMenuItem={setActiveMenuItem}/>
        );
      },
    },
    {
      id: 2,
      label: "Các nhóm",
      icon: "pi pi-fw pi-users",

      template: (item, options) => {
        return (
          <MenuItemSidebar linkTo={"/groups"} item={item} options={options} isActiveMenu={activeMenuItem} setActiveMenuItem={setActiveMenuItem}/>
        );
      },
    },
    {
      id: 3,
      label: "Lịch",
      icon: "pi pi-fw pi-calendar",
      template: (item, options) => {
        return (
          <MenuItemSidebar linkTo={"/lich"} item={item} options={options} isActiveMenu={activeMenuItem} setActiveMenuItem={setActiveMenuItem}/>
        );
      },
    },
    {
      id: 4,
      label: "Tin nhắn",
      icon: "pi pi-fw pi-comment",
      template: (item, options) => {
        return (
          <MenuItemSidebar linkTo={"/messages"} item={item} options={options} isActiveMenu={activeMenuItem} setActiveMenuItem={setActiveMenuItem}/>
        );
      },
    },
    {
      id: 5,
      label: "Nội dung",
      icon: "pi pi-fw pi-cog",
      template: (item, options) => {
        return (
          <MenuItemSidebar linkTo={"/content"} item={item} options={options} isActiveMenu={activeMenuItem} setActiveMenuItem={setActiveMenuItem}/>
        );
      },
    },
    {
      id: 6,
      label: "Cài đặt",
      icon: "pi pi-fw pi-cog",
      template: (item, options) => {
        return (
          <MenuItemSidebar linkTo={"/setting"} item={item} options={options} isActiveMenu={activeMenuItem} setActiveMenuItem={setActiveMenuItem}/>
        );
      },
    },
  ];
  const ITEMS_MENU_USER = [
    {
      label: "File",
      icon: "pi pi-fw pi-file",
    },
    {
      separator: true,
    },
    {
      label: "Đăng xuất",
      icon: "pi pi-fw pi-power-off",
      command : () => {
        if(localStorage.getItem("user")) localStorage.removeItem("user");
        navigate("/")
      }
    },
  ];
  return (
    <div className="card h-full">
      <div className="w-full h-[40px] flex items-center justify-center gap-2">
        <span className="text-black font-bold">TDMU COLLECT</span>
      </div>
      <Menu
        model={items}
        className="w-full h-[calc(100%-110px)] rounded-none border-0 border-b-[1px] border-t-[1px] border-r-[2px]"
      />

      {user ? (
        <div className="card flex justify-content-center">
          <TieredMenu model={ITEMS_MENU_USER} popup ref={menuUser} popupAlignment={"right"} breakpoint="767px"/>
          <button
            className="w-full h-[70px] p-link flex items-center p-1"
            onClick={(e) => {
              menuUser.current.toggle(e);
            }}
          >
            <Avatar
              image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
              className="mr-2"
              shape="circle"
            />
            <div className="flex flex-col align text-black">
              <span className="font-bold">{user.name}</span>
              <span className="text-sm">{user.role}</span>
            </div>
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[70px] w-full">
          <Button
            label="Đăng nhập"
            icon="pi pi-external-link"
            onClick={() => setVisible(true)}
            className="border-1"
          />
          <Dialog
            header="Header"
            visible={visible}
            maximizable
            style={{ width: "80vw" }}
            onHide={() => setVisible(false)}
          >
            <section className="m-0">
              <Login setVisible={setVisible} />
            </section>
          </Dialog>
        </div>
      )}
    </div>
  );
}
