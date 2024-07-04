import { BrandModel } from "@/models/BrandModel";
import { Button, Image, Modal, Space, Tooltip, message } from "antd";
import Table, { ColumnProps } from "antd/es/table";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiPencil, BiTrash } from "react-icons/bi";
import { handleBrandAPI } from "../api/brandAPI";
import { deleteObject, ref } from "firebase/storage";
import { storageFirebase } from "@/firebase/firebaseConfig";
import { BrandModal } from "@/modals";
import { PlusOutlined } from "@ant-design/icons";
import { BsEye } from "react-icons/bs";

const { confirm } = Modal;

const Brands = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState<BrandModel[]>([]);
  const [brandSelected, setBrandSelected] = useState<BrandModel>();

  const [isVisibleBrand, setIsVisibleBrand] = useState(false);
  const [isDetail, setIsDetail] = useState(false);

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

  const handleRemoveBrand = async (id: String, imageURL: any) => {
    // console.log(`Delete ${id}`);

    setIsLoading(true);
    const api = `/remove-brand?id=${id}`;

    try {
      await handleBrandAPI(api, undefined, "delete");

      // xoá hình trong firebase
      if (imageURL) {
        const desertRef = ref(storageFirebase, imageURL);
        await deleteObject(desertRef);
      }

      await handleGetBrand();

      message.success("Remove brand successfully");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleRemoveImageBrand = async () => {

  // }

  const columns: ColumnProps<BrandModel>[] = [
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
          <Tooltip title={`Detail ${item.title}`}>
            <Button
              type="text"
              icon={<BsEye size={20} color={"#1e90ff"} />}
              onClick={() => {
                setIsDetail(true);
                setBrandSelected(item);
                setIsVisibleBrand(true);
              }}
            />
          </Tooltip>
          <Tooltip title={`Edit ${item.title}`}>
            <Button
              type="text"
              icon={<BiPencil size={20} color={"#FFDF00"} />}
              onClick={() => {
                setBrandSelected(item);
                console.log(item);
                setIsVisibleBrand(true);
              }}
            />
          </Tooltip>
          <Tooltip title={`Remove ${item.title}`}>
            <Button
              onClick={() =>
                confirm({
                  title: "Remove",
                  content: `Are you sure you want to delete ${item.title}?`,
                  onOk: () => handleRemoveBrand(item._id, item.imageURL),
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
          {/* <Link href={"/brands/add-new"} className="btn btn-sm btn-success">
            Add new
          </Link> */}
          <Button
            onClick={() => setIsVisibleBrand(true)}
            iconPosition="start"
            icon={<PlusOutlined />}
            style={{ backgroundColor: "#198754", color: "white" }}
          >
            Add New
          </Button>
        </div>
      </div>
      <Table loading={isLoading} dataSource={brands} columns={columns} />

      <BrandModal
        visible={isVisibleBrand}
        onClose={() => {
          setBrandSelected(undefined);
          setIsVisibleBrand(false);
          setIsDetail(false);
        }}
        onReload={handleGetBrand}
        brand={brandSelected}
        detail={isDetail}
      />
    </div>
  );
};

export default Brands;
