import { Layout, Menu } from "antd";
import Link from "next/link";
import React from "react";

const { Sider } = Layout;

const SiderComponent = () => {
  return (
    <Sider style={{ height: "100vh" }}>
      <Menu
        theme="dark"
        items={[
          {
            key: "Home",
            label: <Link href={"/"}>Home</Link>,
          },
          {
            key: "Products",
            label: <Link href={"/products"}>Products</Link>,
          },
        ]}
      />
    </Sider>
  );
};

export default SiderComponent;