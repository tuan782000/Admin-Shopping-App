import {
  Button,
  Card,
  Form,
  Image,
  Input,
  Select,
  Space,
  Tooltip,
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { handleProductAPI } from "../api/productAPI";
import { FaTimesCircle } from "react-icons/fa";
import { SelectModel } from "@/models/SelectModel";
import { BsPlusCircleFill } from "react-icons/bs";
import { BrandModal, CategoryModal } from "@/modals";
import { handleCategoryAPI } from "../api/categoryAPI";
import { handleBrandAPI } from "../api/brandAPI";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storageFirebase } from "@/firebase/firebaseConfig";
import { useSearchParams } from "next/navigation";
import { LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { replaceName } from "@/utils/replaceName";

const AddNewProduct = () => {
  const [files, setFiles] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const [imageURL, setImageURL] = useState("");

  const [brands, setBrands] = useState<SelectModel[]>([]);
  const [categories, setCategories] = useState<SelectModel[]>([]);

  const [isVisibleAddNewBrand, setIsVisibleAddNewBrand] = useState(false);
  const [isVisibleAddNewCategory, setIsVisibleAddNewCategory] = useState(false);

  const [form] = Form.useForm(); // cái này giống useRef - form kết nối form bên dưới để xử lý thông tin
  const inputRef = useRef<any>();

  // dựa vào thanh url truyền vào
  const searchParams = useSearchParams();
  // lấy id
  const id = searchParams.get("id");

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    handleGetCategories();
    handleGetBrands();
  }, []);

  // theo dõi id useEffect sẽ gọi
  useEffect(() => {
    id && getProductDetailById(id);
  }, [id]);

  // const replaceTitle = (title: string) => {
  //   let renameTitle = title.trim();
  //   renameTitle = renameTitle.replace(replaceName)
  // };

  // vừa là thêm mới - vừa là sử
  const handleAddNewProduct = async (values: any) => {
    // setIsLoading(true);
    // console.log(value);
    const data = { ...values };
    const api = id ? `/update-product/${id}` : "/add-product";

    if (files) {
      // console.log(files);
      const file = files[0];
      const name = file.name;

      // console.log(name);
      // đường dẫn
      // ref là firebase/storage
      // Tham số thứ 1: - storageFirebase từ cấu hình firebase - lấy từ firebase/storage
      // Tham số thứ 2: đường dẫn trên firebase
      const path = ref(storageFirebase, `/images/${name}`);

      // Upload from a Blob or File
      await uploadBytes(path, file);
      const downloadURL = await getDownloadURL(path);

      // lúc này đã có link để chúng ta download ảnh về
      console.log(downloadURL);

      // data.imageURL - tên nó phải trùng với thuộc tính của model
      data.imageURL = downloadURL;
      // Tạo thêm cho data 1 key downloadURL, lấy downloadURL đã tạo ra gán vào - lúc này dưới form đã nhận được
    }

    try {
      // const res = await handleProductAPI(api, data, "post");

      // console.log(res);
      data.slug = replaceName(values.title);

      console.log(data);

      await handleProductAPI(api, data, id ? "put" : "post");
      message.success(
        id ? "Update product successfully" : "Add new product successfully"
      );
      form.resetFields();
      handleDeleteFile();

      window.history.back();
      // router.push("/?reload=true"); // Điều hướng về trang index với query parameter reload

      // console.log(data);
    } catch (error: any) {
      console.log(error);
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

  const handleGetCategories = async () => {
    const api = `/all-categories`;

    try {
      const res = await handleCategoryAPI(api, "get");

      // Tại vì muốn hiển thị - hiển thị tên - submit thì submit cái id của item đó - phải có bước này
      if (res.data) {
        const items: SelectModel[] = [];

        res.data.forEach((item: any) =>
          items.push({
            label: item.title,
            value: item._id,
          })
        );

        setCategories(items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetBrands = async () => {
    setIsLoading(true);
    const api = `/all-brands`;

    try {
      const res = await handleBrandAPI(api, "get");

      console.log(res.data);

      if (res.data) {
        const items: SelectModel[] = [];

        res.data.forEach((item: any) =>
          items.push({
            label: item.title,
            value: item._id,
          })
        );
        setBrands(items);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductDetailById = async (id: string) => {
    setIsLoading(true);
    const api = `/detail-product/${id}`;

    try {
      const res = await handleProductAPI(api);
      // console.log(res);
      if (res.data) {
        // console.log(res.data);
        // điền dữ liệu 1 cách tự động cho các ô input đã tồn tại dữ liệu
        form.setFieldsValue(res.data);
        setImageURL(res.data.imageURL);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        type="text"
        onClick={handleBack}
        icon={<LeftOutlined />}
        iconPosition="start"
      >
        Back
      </Button>
      <div className="col-8 offset-2">
        <Card title="Add new product">
          <div className="mb-4">
            {files ? (
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
            ) : imageURL ? (
              <div
                className="mb-4"
                style={{ position: "relative", width: 150, height: 100 }}
              >
                <Image
                  style={{ width: 150, height: 100, objectFit: "cover" }}
                  src={imageURL}
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
            ) : null}
            <Button
              disabled={isLoading}
              onClick={() => inputRef.current.click()}
            >
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
              label={<Space>Title</Space>}
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
              label={<Space>Description</Space>}
              rules={[
                {
                  required: true,
                  message: "title is required",
                },
              ]}
            >
              <Input.TextArea rows={3} placeholder="Description" allowClear />
            </Form.Item>
            <div className="row">
              <div className="col">
                <Form.Item
                  name="categories"
                  label={
                    <Space>
                      Categories
                      <Tooltip title="Add new Category">
                        <BsPlusCircleFill
                          style={{ color: "green" }}
                          onClick={() => setIsVisibleAddNewCategory(true)}
                        />
                      </Tooltip>
                    </Space>
                  }
                >
                  <Select
                    mode="multiple"
                    placeholder="Categories"
                    options={categories}
                  />
                </Form.Item>
              </div>
              <div className="col">
                <Form.Item
                  name="brands"
                  label={
                    <Space>
                      Brands
                      <Tooltip title="Add new Brand">
                        <BsPlusCircleFill
                          style={{ color: "green" }}
                          onClick={() => setIsVisibleAddNewBrand(true)}
                        />
                      </Tooltip>
                    </Space>
                  }
                >
                  <Select placeholder="Brands" options={brands} />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <Form.Item
                  label={<Space>Price</Space>}
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
              </div>
              <div className="col">
                <Form.Item label={<Space>Sizes</Space>} name={"sizes"}>
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
              </div>
              <div className="col">
                <Form.Item label={<Space>Quantity</Space>} name={"quantity"}>
                  <Input placeholder="Quantity" allowClear type="number" />
                </Form.Item>
              </div>
            </div>
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

        <CategoryModal
          visible={isVisibleAddNewCategory}
          onClose={() => setIsVisibleAddNewCategory(false)}
          onReload={handleGetCategories}
        />

        <BrandModal
          visible={isVisibleAddNewBrand}
          onClose={() => setIsVisibleAddNewBrand(false)}
          onReload={handleGetBrands}
        />

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
    </>
  );
};

export default AddNewProduct;
