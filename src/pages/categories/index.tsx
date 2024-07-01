import { CategoryModel } from "@/models/CategoryModel";
import React, { useEffect, useState } from "react";
import { handleCategoryAPI } from "../api/categoryAPI";
import { Button, Image, Modal, Space, Tooltip, message } from "antd";
import Table, { ColumnProps } from "antd/es/table";
import { BiPencil, BiTrash } from "react-icons/bi";
import Link from "next/link";
import { BsEye } from "react-icons/bs";
import { CategoryModal } from "@/modals";

const { confirm } = Modal;

const Categories = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryModel[]>([]);

  const [isVisibleCategory, setIsVisibleCategory] = useState(false);

  useEffect(() => {
    handleGetCategory();
  }, []);

  const handleGetCategory = async () => {
    setIsLoading(true);
    const api = "/all-categories";

    try {
      const res = await handleCategoryAPI(api, "get");

      if (res && res.data) {
        setCategories(res.data);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCategory = async (id: String) => {
    // console.log(`Delete ${id}`);

    setIsLoading(true);
    const api = `/remove-category?id=${id}`;

    try {
      await handleCategoryAPI(api, undefined, "delete");
      await handleGetCategory();

      message.success("Remove category successfully");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnProps<CategoryModel>[] = [
    {
      key: "title",
      dataIndex: "title",
      title: "Title",
      // sort
      sorter: (a: CategoryModel, b: CategoryModel) =>
        a.title.localeCompare(b.title),
    },
    {
      key: "btn",
      dataIndex: "",
      title: "Actions",
      align: "right",
      render: (item: CategoryModel) => (
        <Space>
          <Tooltip title={`Detail ${item.title}`}>
            <Button
              type="text"
              icon={<BsEye size={20} color={"#1e90ff"} />}
              onClick={() => setIsVisibleCategory(true)}
            />
          </Tooltip>
          <Tooltip title={`Edit ${item.title}`}>
            <Button
              type="text"
              href={`/categories/edit/${item._id}`}
              icon={<BiPencil size={20} color={"#FFDF00"} />}
            />
          </Tooltip>
          <Tooltip title={`Remove ${item.title}`}>
            <Button
              onClick={() =>
                confirm({
                  title: "Remove",
                  content: `Are you sure you want to delete ${item.title}?`,
                  onOk: () => handleRemoveCategory(item._id),
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
          <Link href={"/categories/add"} className="btn btn-sm btn-success">
            Add new
          </Link>
        </div>
      </div>
      <Table loading={isLoading} dataSource={categories} columns={columns} />

      <CategoryModal
        visible={isVisibleCategory}
        onClose={() => setIsVisibleCategory(false)}
        detail
      />
    </div>
  );
};

export default Categories;
