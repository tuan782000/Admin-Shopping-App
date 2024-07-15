import { Avatar, Button, Image, Modal, Space, Tooltip, message } from "antd";
import React, { useEffect, useState } from "react";
import { handleProductAPI } from "../api/productAPI";
import Table, { ColumnProps } from "antd/es/table";
import { ProductModel } from "@/models/ProductModel";
import { BiPencil, BiTrash } from "react-icons/bi";
import Link from "next/link";
import { useRouter } from "next/router";

const { confirm } = Modal;

const Products = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductModel[]>([]);

  const router = useRouter();

  useEffect(() => {
    handleGetProducts();
  }, []);

  // useEffect(() => {
  //   if (router.query.reload) {
  //     handleGetProducts();
  //   }
  // }, [router.query.reload]);

  const handleGetProducts = async () => {
    setIsLoading(true);
    const api = "/all-products";
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
    const api = `/remove-product?id=${id}`;

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
      dataIndex: "imageURL",
      render: (url: string) => (
        <Image
          src={url}
          width={100}
          height={100}
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      key: "title",
      // dataIndex: "title", // nếu để title chỉ lấy title - không để lấy hết
      dataIndex: "",
      title: "Title",
      render: (item) => (
        <Link href={`/products/${item._id}`}>{item.title}</Link>
      ),
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
      title: "Actions",
      align: "right",
      render: (item: ProductModel) => (
        <Space>
          <Tooltip title={`Edit ${item.title}`}>
            <Button
              type="text"
              href={`/products/add-new?id=${item._id}&isEdit=true`}
              icon={<BiPencil size={20} color={"#FFDF00"} />}
            />
          </Tooltip>
          <Tooltip title={`Remove ${item.title}`}>
            <Button
              onClick={() =>
                confirm({
                  title: "Remove",
                  content: `Are you sure you want to delete ${item.title}?`,
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

  // Làm chức năng fake data views
  // const handleUpdateView = () => {
  //   products.forEach(async (item) => {
  //     // console.log(item);
  //     const api = `/update-product/${item._id}`;
  //     await handleProductAPI(
  //       api,
  //       { views: Math.floor(Math.random() * 1000) },
  //       "put"
  //     );

  //     console.log("done");
  //   });
  // };
  console.log(products);
  return (
    <div>
      <div className="mb-3 row">
        <div className="col text-end">
          {/* <Button onClick={handleUpdateView}>Update Views</Button> */}
          <Link href={"/products/add-new"} className="btn btn-sm btn-success">
            Add new
          </Link>
        </div>
      </div>
      <Table
        loading={isLoading}
        dataSource={products}
        columns={columns}
        rowKey="_id"
      />
    </div>
  );
};

export default Products;
