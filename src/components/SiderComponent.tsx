import {
  ApartmentOutlined,
  HomeOutlined,
  ProductOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { HiOutlineReceiptPercent } from "react-icons/hi2";

const { Sider } = Layout;

const SiderComponent = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      style={{ height: "100vh", minHeight: "100%" }}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <Menu
        theme="dark"
        items={[
          {
            key: "Home",
            icon: <HomeOutlined />,
            label: <Link href="/">Home</Link>,
          },
          {
            key: "Products",
            icon: <ProductOutlined />,
            label: <Link href="/products">Products</Link>,
          },
          {
            key: "Brands",
            icon: <ShopOutlined />,
            label: <Link href="/brands">Brands</Link>,
          },
          {
            key: "Categories",
            icon: <ApartmentOutlined />,
            label: <Link href="/categories">Categories</Link>,
          },
          {
            key: "PromoCodes",
            icon: <HiOutlineReceiptPercent />,
            label: <Link href="/promoCodes">PromoCodes</Link>,
          },
        ]}
      />
    </Sider>
  );
};

export default SiderComponent;
