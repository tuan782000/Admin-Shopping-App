import { Button, Card, Form, Image, Input, Select, Space, message } from "antd";
import React, { useRef, useState } from "react";
import { handleProductAPI } from "../api/productAPI";

const AddNewProduct = () => {
  const [files, setFiles] = useState<any>();
  const [isLoading, setisLoading] = useState(false);
  const [form] = Form.useForm(); // cái này giống useRef - form kết nối form bên dưới để xử lý thông tin

  const inputRef = useRef<any>();

  const handleAddNewProduct = async (values: any) => {
    setisLoading(true);
    // console.log(value);
    const data = { ...values };
    const api = "/add";

    if (files) {
    }

    try {
      // const res = await handleProductAPI(api, data, "post");

      // console.log(res);

      await handleProductAPI(api, data, "post");
      message.success("Add new product successfully");
      form.resetFields();
      window.history.back();
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    } finally {
      setisLoading(false);
    }
  };
  return (
    <div className="col-8 offset-2">
      <Card title="Add new product">
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
          onFinish={handleAddNewProduct}
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
            name={"description"}
            rules={[
              {
                required: true,
                message: "title is required",
              },
            ]}
          >
            <Input.TextArea rows={3} placeholder="Description" allowClear />
          </Form.Item>
          <Form.Item
            name={"price"}
            rules={[
              {
                required: true,
                message: "price is required",
              },
            ]}
          >
            <Input placeholder="Price" allowClear type="number" />
          </Form.Item>
          <Form.Item name={"sizes"}>
            <Select
              placeholder="Sizes"
              allowClear
              mode="multiple"
              options={[
                { label: "S", value: "S" },
                { label: "M", value: "M" },
                { label: "L", value: "L" },
                { label: "X", value: "X" },
                { label: "XL", value: "XL" },
                { label: "XXL", value: "XXL" },
                { label: "XXXL", value: "XXXL" },
              ]}
            />
          </Form.Item>
          <Form.Item name={"quantity"}>
            <Input placeholder="Quantity" allowClear type="number" />
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
        {/* Kết nối với form trên */}
      </Card>

      {/* ẩn đi input này sau đó dùng useRef gắn địa chỉ input này vào button - lúc này nhấn vào button đồng nghĩa đang nhấn vào input này */}
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

export default AddNewProduct;
