import { Button, Card, Form, Image, Input, Space, message } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useRef, useState } from "react";
import { handleBrandAPI } from "../api/brandAPI";

const AddNewBrand = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<any>();
  const [form] = Form.useForm();

  const inputRef = useRef<any>();

  const handleAddNewBrand = async (values: any) => {
    setIsLoading(true);
    const data = { ...values };
    const api = "/add-brand";

    if (files) {
    }

    try {
      await handleBrandAPI(api, data, "post");
      message.success("Add new product successfully");
      form.resetFields();
      window.history.back();
    } catch (error: any) {
      console.log(error);
      error.message(message.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="col-8 offset-2">
      <Card title="Add new brand">
        <div className="mb-4">
          {files && (
            <div className="mb-4">
              <Image
                src={URL.createObjectURL(files[0])}
                style={{ width: 150, height: 100 }}
              />
            </div>
          )}
          <Button disabled={isLoading} onClick={() => inputRef.current.click()}>
            Upload Image
          </Button>
        </div>
        <Form
          disabled={isLoading}
          form={form}
          size="large"
          layout="vertical"
          onFinish={handleAddNewBrand}
        >
          <Form.Item
            name={"title"}
            rules={[
              {
                required: true,
                message: "title is required",
              },
            ]}
          >
            <Input placeholder="Title" allowClear maxLength={150} showCount />
          </Form.Item>
          <Form.Item
            name={"key"}
            rules={[
              {
                required: true,
                message: "key is required",
              },
            ]}
          >
            <Input placeholder="Key" allowClear maxLength={150} showCount />
          </Form.Item>
        </Form>
        <div className="text-end mt-4">
          <Space>
            <Button
              disabled={isLoading}
              type="primary"
              ghost
              danger
              style={{ padding: "20px 40px" }}
              onClick={() => form.resetFields()}
            >
              Reset all fields
            </Button>
            {/* Khi bấm submit thì form này sẽ truyền value vào handleAddNewProduct */}
            {/* Nếu không đầy đủ dữ liệu không cho submit lên */}
            <Button
              disabled={isLoading}
              type={"primary"}
              style={{ padding: "20px 40px" }}
              onClick={() => form.submit()}
            >
              Publish
            </Button>
          </Space>
        </div>
      </Card>

      <div className="d-none">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(val) => setFiles(val.target.files)}
        />
      </div>
    </div>
  );
};

export default AddNewBrand;
