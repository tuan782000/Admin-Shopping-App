import { Button, Image, Modal, Space, Tooltip, message } from "antd";
import React, { useEffect, useState } from "react";
import { handleProductAPI } from "../api/productAPI";
import Table, { ColumnProps } from "antd/es/table";
import { ProductModel } from "@/models/ProductModel";
import { BiTrash } from "react-icons/bi";
import Link from "next/link";

const { confirm } = Modal;

const Products = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductModel[]>([]);

  useEffect(() => {
    handleGetProducts();
  }, []);
  const handleGetProducts = async () => {
    setIsLoading(true);
    const api = "/all";
    try {
      const res = await handleProductAPI(api, "get"); // nhận 3 tham số api, data, và method - xem lại productAPI
      //   if (res) {
      //     console.log(res); // bên mobile res.data vì data bọc trong data - ở web res.data mobile res.data.data
      //   }
      if (res && res.data) {
        setProducts(res.data);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProduct = async (id: String) => {
    setIsLoading(true);
    const api = `/remove?id=${id}`;

    try {
      await handleProductAPI(api, undefined, "delete");
      await handleGetProducts();

      message.success("Remove product successfully");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnProps<ProductModel>[] = [
    {
      key: "img",
      dataIndex: "img",
      render: (url: string) => <Image src={url} style={{ width: 120 }} />,
    },
    {
      key: "title",
      dataIndex: "title",
      title: "Title",
      // sort
      sorter: (a: ProductModel, b: ProductModel) =>
        a.title.localeCompare(b.title),
    },
    {
      key: "price",
      dataIndex: "price",
      title: "Price",
      align: "right",
      // sort
      sorter: (a: ProductModel, b: ProductModel) =>
        a.title.localeCompare(b.title),
    },
    {
      key: "quantity",
      dataIndex: "quantity",
      title: "Quantity",
      align: "right",
      // sort
      sorter: (a: ProductModel, b: ProductModel) =>
        a.title.localeCompare(b.title),
    },
    {
      key: "btn",
      dataIndex: "",
      align: "right",
      render: (item: ProductModel) => (
        <Space>
          <Tooltip title={"Remove item"}>
            <Button
              onClick={() =>
                confirm({
                  title: "Remove",
                  content: "Are you sure you want to delete it?",
                  onOk: () => handleRemoveProduct(item._id),
                  okText: "Delete", // button xoá trong modal
                })
              }
              icon={<BiTrash color="red" size={20} />}
              type="text"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-3 row">
        <div className="col text-end">
          <Link href={"/products/add-new"} className="btn btn-sm btn-success">
            Add new
          </Link>
        </div>
      </div>
      <Table loading={isLoading} dataSource={products} columns={columns} />
    </div>
  );
};

export default Products;
