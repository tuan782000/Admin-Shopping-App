import { storageFirebase } from "@/firebase/firebaseConfig";
import { BrandModel } from "@/models/BrandModel";
import { handleBrandAPI } from "@/pages/api/brandAPI";
import { Avatar, Button, Form, Image, Input, Modal, message } from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useRef, useState } from "react";
import { FaTimesCircle } from "react-icons/fa";

type Props = {
  visible: boolean; // trạng thái mở hoặc không
  onClose: () => void; // đóng form
  onReload?: () => void; // khi submit nó sẽ làm việc gì đó
  brand?: BrandModel;
  detail?: BrandModel;
};

const BrandModal = (props: Props) => {
  const { visible, onClose, onReload, brand, detail } = props;

  const [files, setFiles] = useState<any>();

  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();
  const inputRef = useRef<any>();

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleAddBrand = async (values: any) => {
    setIsLoading(true);
    const api = "/add-brand";
    const data = { ...values };

    if (files) {
      const file = files[0];
      const name = file.name;

      const path = ref(storageFirebase, `/images/${name}`);

      await uploadBytes(path, file);
      const downloadURL = await getDownloadURL(path);

      data.imageURL = downloadURL;
    }

    try {
      await handleBrandAPI(api, data, "post");

      message.success("Added brand success");

      handleClose();

      onReload && onReload();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFile = () => {
    // khi xoá sẽ cập nhật setFile đồng thời set ref về rỗng để xoá hẳn
    setFiles(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return detail ? (
    <Modal title="Detail"></Modal>
  ) : (
    <Modal
      title={brand ? "Edit brand" : "Add new brand"}
      open={visible}
      onCancel={handleClose}
      onClose={handleClose}
      onOk={() => form.submit()}
      // set trạng thái của button
      okButtonProps={{
        loading: isLoading,
      }}
      okText="Create"
    >
      <Form
        onFinish={handleAddBrand}
        disabled={isLoading}
        layout="vertical"
        size="large"
        form={form}
      >
        <div className="mb-4">
          {files && (
            <div
              className="mb-4"
              style={{ position: "relative", width: 150, height: 100 }}
            >
              <Image
                style={{ width: 150, height: 100, objectFit: "cover" }}
                src={URL.createObjectURL(files[0])}
              />
              <FaTimesCircle
                style={{
                  position: "absolute",
                  top: -14,
                  right: -10,
                  cursor: "pointer",
                  color: "red",
                  fontSize: "20px",
                }}
                onClick={handleDeleteFile}
              />
            </div>
          )}
          <Button disabled={isLoading} onClick={() => inputRef.current.click()}>
            Upload Image
          </Button>
        </div>
        <Form.Item
          name={"title"}
          rules={[{ message: "Title is required", required: true }]}
        >
          <Input placeholder="Title" disabled={isLoading} />
        </Form.Item>
        <Form.Item name={"description"}>
          <Input placeholder="Description" disabled={isLoading} />
        </Form.Item>
      </Form>
      <div className="d-none">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(val) => setFiles(val.target.files)}
        />
      </div>
    </Modal>
  );
};

export default BrandModal;
