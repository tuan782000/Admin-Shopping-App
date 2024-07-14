import { DatePicker, Form, Input, InputNumber, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { handlePromoCodeAPI } from "@/pages/api/promoCodeAPI";
import { PercentageOutlined } from "@ant-design/icons";
import { PromoModel } from "@/models/PromoModel";
import { DateTimeFormat } from "@/utils/datetime";

interface Props {
  visible: boolean; // trạng thái mở hoặc không
  onClose: () => void; // đóng form
  onReload?: () => void; // khi submit nó sẽ làm việc gì đó
  promoCode?: PromoModel | any;
  detail?: boolean;
}

const PromoModal = (props: Props) => {
  const { visible, onClose, onReload, promoCode, detail } = props;
  const [isLoading, setisLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (promoCode) {
      form.setFieldsValue({
        ...promoCode,
        times:
          promoCode.start && promoCode.end
            ? [dayjs(promoCode.start), dayjs(promoCode.end)]
            : undefined,
      });
    }
  }, [promoCode, detail]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  // console.log(promoCode._id);

  const handlePromo = async (values: any) => {
    const times = values.times;

    const data: {
      title: string;
      description: string;
      code: string;
      percent: number;
      start?: number;
      end?: number;
    } = {
      title: values.title,
      description: values.description,
      code: values.code,
      percent: parseFloat(values.percent ?? 0),
    };

    if (times && times.length > 0) {
      data.start = times[0] ? new Date(times[0]).getTime() : undefined;
      data.end = times[1] ? new Date(times[1]).getTime() : undefined;
    }

    console.log(promoCode._id);

    // console.log(data.code, data.title, data.percent);
    const api = promoCode
      ? `/update-promoCode/${promoCode._id}`
      : `/add-promoCode`;

    try {
      setisLoading(true);
      await handlePromoCodeAPI(api, data, promoCode ? "put" : "post");

      message.success(
        promoCode
          ? "Update PromoCode successfully"
          : "Create PromoCode successfully"
      );

      handleClose();

      onReload && onReload();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setisLoading(false);
      handleClose();
    }
  };

  return detail ? (
    <Modal
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      title="Detail Category"
      footer={null}
    >
      {promoCode.title && (
        <p style={{ fontSize: 18 }}>Title: {promoCode.title}</p>
      )}
      {promoCode.description && (
        <p style={{ fontSize: 18 }}>Description: {promoCode.description}</p>
      )}
      {promoCode.code && <p style={{ fontSize: 18 }}>Code: {promoCode.code}</p>}
      {promoCode.percent && (
        <p style={{ fontSize: 18 }}>Percent: {promoCode.percent}</p>
      )}
      {promoCode.start && (
        <p style={{ fontSize: 18 }}>
          Start:
          {promoCode.start
            ? dayjs(promoCode.start).format("DD/MM/YYYY")
            : "N/A"}
        </p>
      )}
      {promoCode.end && (
        <p style={{ fontSize: 18 }}>
          End:{" "}
          {promoCode.end ? dayjs(promoCode.end).format("DD/MM/YYYY") : "N/A"}
        </p>
      )}
    </Modal>
  ) : (
    <Modal
      open={visible}
      title={promoCode ? "Edit promoCode" : "Add new promoCode"}
      onClose={handleClose}
      onCancel={handleClose}
      // set trạng thái của button
      okButtonProps={{
        loading: isLoading,
      }}
      onOk={() => form.submit()}
      okText={promoCode ? "Update" : "Create"}
    >
      <Form
        onFinish={handlePromo}
        disabled={isLoading}
        layout="vertical"
        size="large"
        form={form}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ message: "What is promCode", required: true }]}
        >
          <Input placeholder="Title" />
        </Form.Item>
        <Form.Item label="Description" name={"description"}>
          <Input.TextArea placeholder="Description" />
        </Form.Item>
        <Form.Item
          label="Code"
          name="code"
          rules={[{ message: "What is code", required: true }]}
        >
          <Input placeholder="Code" style={{ textTransform: "uppercase" }} />
        </Form.Item>
        <Form.Item
          label="Percent"
          name="percent"
          rules={[{ message: "What is percent", required: true }]}
        >
          <InputNumber
            min={0}
            max={100}
            placeholder="percent"
            suffix={<PercentageOutlined style={{ marginRight: 20 }} />}
            style={{ width: "100%" }}
          />
        </Form.Item>
        {/* handlePromo bắt value dựa vào các name mà ta cung cấp cho nên cố gắng viết đúng name */}
        <Form.Item
          name="times"
          label="The start date of the code's expiration"
          rules={[
            {
              type: "array",
              required: true,
              message: "Please select time range!",
            },
          ]}
        >
          <DatePicker.RangePicker format="DD-MM-YYYY" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PromoModal;
