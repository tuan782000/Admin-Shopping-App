import { BrandModel } from "@/models/BrandModel";
import { Button, Image, Modal, Space, Tooltip, message } from "antd";
import Table, { ColumnProps } from "antd/es/table";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { handleBrandAPI } from "../api/brandAPI";

const { confirm } = Modal;

const Brands = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState<BrandModel[]>([]);
  useEffect(() => {
    handleGetBrand();
  }, []);

  const handleGetBrand = async () => {
    setIsLoading(true);
    const api = "/all-brands";

    try {
      const res = await handleBrandAPI(api, "get");

      if (res && res.data) {
        setBrands(res.data);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBrand = async (id: String) => {
    // console.log(`Delete ${id}`);

    setIsLoading(true);
    const api = `/remove-brand?id=${id}`;

    try {
      await handleBrandAPI(api, undefined, "delete");
      await handleGetBrand();

      message.success("Remove brand successfully");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnProps<BrandModel>[] = [
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
      sorter: (a: BrandModel, b: BrandModel) => a.title.localeCompare(b.title),
    },
    {
      key: "btn",
      dataIndex: "",
      title: "Actions",
      align: "right",
      render: (item: BrandModel) => (
        <Space>
          <Tooltip title={`Remove ${item.title}`}>
            <Button
              onClick={() =>
                confirm({
                  title: "Remove",
                  content: `Are you sure you want to delete ${item.title}?`,
                  onOk: () => handleRemoveBrand(item._id),
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
          <Link href={"/brands/add-new"} className="btn btn-sm btn-success">
            Add new
          </Link>
        </div>
      </div>
      <Table loading={isLoading} dataSource={brands} columns={columns} />
    </div>
  );
};

export default Brands;
