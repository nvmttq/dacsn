import React from "react";

import { classNames } from "primereact/utils";

export default function ItemSidebar({activeMenuItem, handleChangePage}) {

  return {
    id: 1,
    label: "Khóa học",
    icon: "pi pi-fw pi-book",
    command: function () {
      handleChangePage("KH", 1);
    },
    template: (item, options) => {
      return (
        /* custom element */
        <a
          href={"https://facebook.com"}
          className={options.className}
          target={item.target}
          onClick={options.onClick}
        >
          <span
            className={classNames(options.iconClassName, item.icon)}
            style={{ color: "#76C044" }}
          ></span>
          <span className={options.labelClassName} style={{ color: "white" }}>
            {item.label}
          </span>
        </a>
      );
    },
    className: classNames({
      active: activeMenuItem === 1 ? true : false,
    }),
  };
}
