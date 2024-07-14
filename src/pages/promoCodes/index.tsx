import { PromoModal } from "@/modals";
import { PromoModel } from "@/models/PromoModel";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Space, Tooltip, message } from "antd";
import Table, { ColumnProps } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { BiPencil, BiTrash } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { handlePromoCodeAPI } from "../api/promoCodeAPI";
import dayjs from "dayjs";

const { confirm } = Modal;

const PromoCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [promoCodes, setPromoCodes] = useState<PromoModel[]>([]);
  const [promoCodeSelected, setPromoCodeSelected] = useState<PromoModel>();

  const [isVisiblePromoCode, setIsVisiblePromoCode] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  useEffect(() => {
    handleGetPromoCode();
  }, []);

  const handleGetPromoCode = async () => {
    setIsLoading(true);
    const api = `/all-promoCode`;

    try {
      const res = await handlePromoCodeAPI(api, "get");

      if (res && res.data) {
        setPromoCodes(res.data);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCode = async (id: string) => {
    setIsLoading(true);
    const api = `/remove-promoCode?id=${id}`;

    console.log(id);

    try {
      await handlePromoCodeAPI(api, undefined, "delete");
      await handleGetPromoCode();

      message.success("Remove promocode successfully");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnProps<PromoModel>[] = [
    {
      key: "title",
      dataIndex: "title",
      title: "Title",
      // sort
      sorter: (a: PromoModel, b: PromoModel) => a.title.localeCompare(b.title),
    },
    {
      key: "code",
      dataIndex: "code",
      title: "Code",
    },
    {
      key: "percent",
      dataIndex: "percent",
      title: "Percent",
      render: (percent) => percent + "%",
    },
    {
      key: "start",
      dataIndex: "start",
      title: "Start",
      render: (start) => (start ? dayjs(start).format("DD/MM/YYYY") : "N/A"),
    },
    {
      key: "end",
      dataIndex: "end",
      title: "End",
      render: (end) => (end ? dayjs(end).format("DD/MM/YYYY") : "N/A"),
    },
    {
      key: "btn",
      dataIndex: "",
      title: "Actions",
      align: "right",
      render: (item: PromoModel) => (
        <Space>
          <Tooltip title={`Detail ${item.title}`}>
            <Button
              type="text"
              icon={<BsEye size={20} color={"#1e90ff"} />}
              onClick={() => {
                setIsDetail(true);
                setPromoCodeSelected(item);
                setIsVisiblePromoCode(true);
              }}
            />
          </Tooltip>
          <Tooltip title={`Edit ${item.title}`}>
            <Button
              type="text"
              icon={<BiPencil size={20} color={"#FFDF00"} />}
              onClick={() => {
                setPromoCodeSelected(item);
                // console.log(item);
                setIsVisiblePromoCode(true);
              }}
            />
          </Tooltip>
          <Tooltip title={`Remove ${item.title}`}>
            <Button
              onClick={() =>
                confirm({
                  title: "Remove",
                  content: `Are you sure you want to delete ${item.title}?`,
                  onOk: () => handleRemoveCode(item._id),
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
          <Button
            onClick={() => setIsVisiblePromoCode(true)}
            iconPosition="start"
            icon={<PlusOutlined />}
            style={{ backgroundColor: "#198754", color: "white" }}
          >
            Add New
          </Button>
        </div>
      </div>
      <Table
        loading={isLoading}
        dataSource={promoCodes}
        columns={columns}
        rowKey="_id"
      />

      {/* 
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
      */}
      <PromoModal
        visible={isVisiblePromoCode}
        onClose={() => {
          setPromoCodeSelected(undefined);
          setIsVisiblePromoCode(false);
          setIsDetail(false);
        }}
        onReload={handleGetPromoCode}
        promoCode={promoCodeSelected}
        detail={isDetail}
      />
    </div>
  );
};

export default PromoCode;
