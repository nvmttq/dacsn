import React from "react";
import { Link } from "react-router-dom";
import { classNames } from "primereact/utils";


export default function MenuItemSidebar({item, options, isActiveMenu, setActiveMenuItem}) {
    return (
        <Link
            to="/"
            className={
              options.className +
              " " +
              (isActiveMenu === item.id ? "active" : "")
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
}