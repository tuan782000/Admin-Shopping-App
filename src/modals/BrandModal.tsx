import { storageFirebase } from "@/firebase/firebaseConfig";
import { BrandModel } from "@/models/BrandModel";
import { handleBrandAPI } from "@/pages/api/brandAPI";
import { Avatar, Button, Form, Image, Input, Modal, message } from "antd";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { FaTimesCircle } from "react-icons/fa";

type Props = {
  visible: boolean; // trạng thái mở hoặc không
  onClose: () => void; // đóng form
  onReload?: () => void; // khi submit nó sẽ làm việc gì đó
  brand?: BrandModel;
  detail?: boolean;
};

const BrandModal = (props: Props) => {
  const { visible, onClose, onReload, brand, detail } = props;
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (brand) {
      form.setFieldsValue(brand);
      setFiles(brand.imageURL);
    }
  }, [detail, brand]);

  const handleClose = () => {
    form.resetFields();
    handleDeleteFile();
    onClose();
  };

  const [files, setFiles] = useState<any>();
  const inputRef = useRef<any>();

  const handleBrand = async (values: any) => {
    setIsLoading(true);
    const api = brand ? `/edit-brand/${brand._id}` : "/add-brand";
    const data = { ...values };

    if (files) {
      const file = files[0];
      const name = file.name;

      const path = ref(storageFirebase, `/images/${name}`);

      await uploadBytes(path, file);
      const downloadURL = await getDownloadURL(path);

      data.imageURL = downloadURL;
    }

    /*
        // xoá hình trong firebase
    if (brand?.imageURL) {
      const desertRef = ref(storageFirebase, brand?.imageURL);
      await deleteObject(desertRef);
    }
    */

    try {
      await handleBrandAPI(api, data, brand ? "put" : "post");

      message.success(brand ? "Updated brand success" : "Added brand success");

      handleClose();

      onReload && onReload();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFile = async () => {
    // khi xoá sẽ cập nhật setFile đồng thời set ref về rỗng để xoá hẳn
    setFiles(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return detail && brand ? (
    <Modal
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      title="Detail Brand"
      footer={null}
    >
      <p style={{ fontSize: 18 }}>Title: {brand.title}</p>
      {brand.description && (
        <p style={{ fontSize: 18 }}>Description: {brand.description}</p>
      )}
      {brand.imageURL && (
        <div style={{ width: "100%", textAlign: "center" }}>
          <p style={{ fontSize: 18, textAlign: "left" }}>Image:</p>
          <Image
            src={brand.imageURL}
            alt={brand.title}
            style={{
              width: 150,
              height: 150,
            }}
          />
        </div>
      )}
    </Modal>
  ) : (
    <Modal
      open={visible}
      title={brand ? "Edit brand" : "Add new brand"}
      onCancel={handleClose}
      onClose={handleClose}
      onOk={() => form.submit()}
      // set trạng thái của button
      okButtonProps={{
        loading: isLoading,
      }}
      okText={brand ? "Update" : "Create"}
    >
      <Form
        onFinish={handleBrand}
        disabled={isLoading}
        layout="vertical"
        size="large"
        form={form}
      >
        <div className="mb-4">
          {files ? (
            <div
              className="mb-4"
              style={{ position: "relative", width: 150, height: 100 }}
            >
              <Image
                style={{ width: 150, height: 100, objectFit: "cover" }}
                src={brand ? files : URL.createObjectURL(files[0])}
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
          ) : (
            <Button
              disabled={isLoading}
              onClick={() => inputRef.current.click()}
            >
              Upload Image
            </Button>
          )}
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
