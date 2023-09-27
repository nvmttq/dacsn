import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Avatar } from "primereact/avatar";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";

// PAGES
import Login from "../pages/Login.js";

export default function MenuSidebar({ user, setUser }) {
  const [activeMenuItem, setActiveMenuItem] = useState(1);

  const [visible, setVisible] = useState(false);

  console.log(activeMenuItem, user);


 
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
          <a
            href="https://facebook.com"
            className={options.className}
            target={item.target}
            onClick={(e) => options.onClick(e)}
          >
            <span
              className={classNames(options.iconClassName, "pi pi-home")}
              style={{ color: "#76C044" }}
            ></span>
            <span className={options.labelClassName} style={{ color: "white" }}>
              {item.label}
            </span>
          </a>
        );
      },
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
        <button
          onClick={(e) => e}
          className="w-full h-[70px] p-link flex items-center p-1"
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
              <Login user={user} setUser={setUser} />
            </section>
          </Dialog>
        </div>
      )}
    </div>
  );
}
