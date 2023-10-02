import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Avatar } from "primereact/avatar";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { TieredMenu } from "primereact/tieredmenu";

// PAGES
import Login from "../pages/Login.js";


export default function MenuSidebar() {

  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState(1);
  const menuUser = useRef(null);
  const [visible, setVisible] = useState(false);
  let user;
  if (localStorage.getItem("user")) {
    user = JSON.parse(localStorage.getItem("user"));
  }
  console.log(activeMenuItem);

  let items = [
    {
      id: 1,
      label: "Khóa học",
      icon: "pi pi-fw pi-book",
      template: (item, options) => {
        return (
          /* custom element */
          <Link
            to="/"
            className={
              options.className +
              " " +
              (activeMenuItem === item.id ? "active" : "")
            }
            onClick={(e) => setActiveMenuItem(item.id)}
          >
            <span
              className={classNames(options.iconClassName, item.icon)}
              style={{ color: "#76C044" }}
            ></span>
            <span className={options.labelClassName} style={{ color: "white" }}>
              {item.label}
            </span>
          </Link>
        );
      },
    },
    {
      id: 2,
      label: "Các nhóm",
      icon: "pi pi-fw pi-users",

      template: (item, options) => {
        return (
          /* custom element */
          <Link
            to="/groups"
            className={
              options.className +
              " " +
              (activeMenuItem === item.id ? "active" : "")
            }
            onClick={(e) => setActiveMenuItem(item.id)}
          >
            <span
              className={classNames(options.iconClassName, item.icon)}
              style={{ color: "#76C044" }}
            ></span>
            <span className={options.labelClassName} style={{ color: "white" }}>
              {item.label}
            </span>
          </Link>
        );
      },
    },
    {
      id: 3,
      label: "Lịch",
      icon: "pi pi-fw pi-calendar",
      template: (item, options) => {
        return (
          /* custom element */
          <Link
            to="/lich"
            className={
              options.className +
              " " +
              (activeMenuItem === item.id ? "active" : "")
            }
            onClick={(e) => setActiveMenuItem(item.id)}
          >
            <span
              className={classNames(options.iconClassName, item.icon)}
              style={{ color: "#76C044" }}
            ></span>
            <span className={options.labelClassName} style={{ color: "white" }}>
              {item.label}
            </span>
          </Link>
        );
      },
    },
    {
      id: 4,
      label: "Tin nhắn",
      icon: "pi pi-fw pi-comment",
      template: (item, options) => {
        return (
          /* custom element */
          <Link
            to="/messages"
            className={
              options.className +
              " " +
              (activeMenuItem === item.id ? "active" : "")
            }
            onClick={(e) => setActiveMenuItem(item.id)}
          >
            <span
              className={classNames(options.iconClassName, item.icon)}
              style={{ color: "#76C044" }}
            ></span>
            <span className={options.labelClassName} style={{ color: "white" }}>
              {item.label}
            </span>
          </Link>
        );
      },
    },
    {
      id: 5,
      label: "Nội dung",
      icon: "pi pi-fw pi-cog",
      template: (item, options) => {
        return (
          /* custom element */
          <Link
            to="/content"
            className={
              options.className +
              " " +
              (activeMenuItem === item.id ? "active" : "")
            }
            onClick={(e) => setActiveMenuItem(item.id)}
          >
            <span
              className={classNames(options.iconClassName, item.icon)}
              style={{ color: "#76C044" }}
            ></span>
            <span className={options.labelClassName} style={{ color: "white" }}>
              {item.label}
            </span>
          </Link>
        );
      },
    },
    {
      id: 6,
      label: "Cài đặt",
      icon: "pi pi-fw pi-cog",
      template: (item, options) => {
        return (
          /* custom element */
          <Link
            to="/setting"
            className={
              options.className +
              " " +
              (activeMenuItem === item.id ? "active" : "")
            }
            onClick={(e) => setActiveMenuItem(item.id)}
          >
            <span
              className={classNames(options.iconClassName, item.icon)}
              style={{ color: "#76C044" }}
            ></span>
            <span className={options.labelClassName} style={{ color: "white" }}>
              {item.label}
            </span>
          </Link>
        );
      },
    },
    {
      label: "AAA",
      template: (item, options) => {
        return (
          /* custom element */
          <Link to="/meeting" className={options.className}>
            <span
              className={classNames(options.iconClassName, "pi pi-home")}
              style={{ color: "#76C044" }}
            ></span>
            <span className={options.labelClassName} style={{ color: "white" }}>
              {item.label}
            </span>
          </Link>
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
        <span className="text-white font-bold">TDMU COLLECT</span>
      </div>
      <Menu
        model={items}
        className="w-full h-[calc(100%-110px)] rounded-none bg-[#222222] border-0 border-b-[1px] border-t-[1px]"
      />

      {user ? (
        <div className="card flex justify-content-center">
          <TieredMenu model={ITEMS_MENU_USER} popup ref={menuUser} breakpoint="767px"/>
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
            <div className="flex flex-col align text-white">
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
            className="bg-[#222] border-1"
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
