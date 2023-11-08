import { classNames } from "primereact/utils";
import React from "react";

import { Link } from "react-router-dom";

export default function MenuItemSidebar({
  linkTo,
  item,
  options,
  isActiveMenu,
  setActiveMenuItem,
}) {
  return (
    <Link
      to={linkTo}
      className={classNames(
        options.className,
        isActiveMenu === item.id ? "!text-icon-color" : "",
        "font-[500]",
      )}
      onClick={(e) => {
        setActiveMenuItem(item.id);
      }}
    >
      <span
        className={classNames(options.iconClassName, item.icon, "!text-icon-color")}
      ></span>

      <span className={options.labelClassName}>{item.label}</span>
    </Link>
  );
}
