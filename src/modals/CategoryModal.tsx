import { CategoryModel } from "@/models/CategoryModel";
import { handleCategoryAPI } from "@/pages/api/categoryAPI";
import { Button, Form, Input, Modal, Space, message } from "antd";
import React, { useState } from "react";

type Props = {
  visible: boolean; // trạng thái mở hoặc không
  onClose: () => void; // đóng form
  onReload?: () => void; // khi submit nó sẽ làm việc gì đó
  category?: CategoryModel;
  detail?: boolean;
};

const CategoryModal = (props: Props) => {
  const { visible, onClose, onReload, category, detail } = props;
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleCategory = async (values: any) => {
    setIsLoading(true);
    const api = "/add-category";

    try {
      await handleCategoryAPI(api, values, "post");

      message.success("Added category success");

      handleClose();

      onReload && onReload();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return detail ? (
    <Modal
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      title="Detail"
    >
      <p>Hello</p>
    </Modal>
  ) : (
    <Modal
      open={visible}
      title={category ? "Edit category" : "Add new category"}
      onClose={handleClose}
      onCancel={handleClose}
      // set trạng thái của button
      okButtonProps={{
        loading: isLoading,
      }}
      onOk={() => form.submit()}
      okText="Create"
      // Bạn có thể tự custom
      //   footer={
      //     <>
      //       <Space>
      //         <Button onClick={() => form.submit()}>ABC</Button>
      //       </Space>
      //     </>
      //   }
    >
      <Form
        onFinish={handleCategory}
        disabled={isLoading}
        layout="vertical"
        size="large"
        form={form}
      >
        <Form.Item
          name={"title"}
          rules={[{ message: "What is category", required: true }]}
        >
          <Input placeholder="Title" />
        </Form.Item>
        <Form.Item name={"description"}>
          <Input.TextArea placeholder="Description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryModal;
