import React, { useEffect, useState } from "react";
import { Button, Card, Col, Image, Row, Space, Spin, message } from "antd";

import { useRouter } from "next/router";
import { LeftOutlined } from "@ant-design/icons";
import { ProductModel } from "@/models/ProductModel";
import { handleProductAPI } from "../api/productAPI";
import Title from "antd/es/typography/Title";
import { BrandModel } from "@/models/BrandModel";
import { CategoryModel } from "@/models/CategoryModel";
import { handleBrandAPI } from "../api/brandAPI";
import { handleCategoryAPI } from "../api/categoryAPI";

const ProductDetail = () => {
  const router = useRouter();
  const [product, setProduct] = useState<ProductModel>();

  const [brandId, setBrandId] = useState<string>("");
  const [categoriesId, setCategoriesId] = useState<string[]>([]);

  const [brands, setBrands] = useState<BrandModel[]>([]);
  const [categories, setCategories] = useState<CategoryModel[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const { id } = router.query; // Lấy id từ URL

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    getProductById();
  }, []);

  useEffect(() => {
    handleGetBrands();
    handleGetCategories();
  }, [product]);

  const handleGetBrands = async () => {
    setIsLoading(true);
    const api = `/all-brands`;

    try {
      const res = await handleBrandAPI(api, "get");

      console.log(res.data);

      if (res.data) {
        const items: any = [];

        res.data.forEach((item: any) => {
          console.log(brandId);
          if (item._id === brandId) {
            items.push({
              _id: item._id,
              title: item.title,
              imageURL: item.imageURL,
            });
          }
        });

        setBrands(items);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCategories = async () => {
    const api = `/all-categories`;

    try {
      const res = await handleCategoryAPI(api, "get");

      console.log(res.data);

      if (res.data) {
        const items: any = [];

        res.data.forEach((item: any) => {
          console.log(categoriesId);
          if (categoriesId.includes(item._id)) {
            items.push({
              _id: item._id,
              title: item.title,
            });
          }
        });
        setCategories(items);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getProductById = async () => {
    setIsLoading(true);
    const api = `/detail-product/${id}`;
    console.log(api);
    try {
      const res = await handleProductAPI(api);
      setBrandId(res.data.brands);
      setCategoriesId(res.data.categories);

      setProduct(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        type="text"
        onClick={handleBack}
        icon={<LeftOutlined />}
        iconPosition="start"
      >
        Back
      </Button>
      <div className="mt-3">
        {isLoading ? (
          <Spin />
        ) : (
          product && (
            <Card>
              <Row gutter={16}>
                <Col span={8}>
                  <Image src={product.imageURL} alt={product.title} />
                </Col>
                <Col span={16}>
                  <Title level={2}>{product.title}</Title>
                  <Space align="baseline">
                    <span style={{ fontSize: 20 }}>Price: </span>
                    <span style={{ fontSize: 18 }}>${product.price}</span>
                  </Space>
                  <br />
                  <Space align="baseline">
                    <span style={{ fontSize: 20 }}>Description: </span>
                    <span style={{ fontSize: 18 }}>${product.description}</span>
                  </Space>
                  <br />
                  <Space align="baseline">
                    <span style={{ fontSize: 20 }}>Sizes: </span>
                    <span style={{ fontSize: 18 }}>
                      {product.sizes.join(", ")}
                    </span>
                  </Space>
                  <br />
                  <Space align="baseline">
                    <span style={{ fontSize: 20 }}>Quantity: </span>
                    <span style={{ fontSize: 18 }}>{product.quantity}</span>
                  </Space>
                  <br />
                  <Space align="baseline">
                    <span style={{ fontSize: 20 }}>Views: </span>
                    <span style={{ fontSize: 18 }}>{product.views}</span>
                  </Space>
                  <br />
                  <Space align="baseline">
                    <span style={{ fontSize: 20 }}>Brands: </span>
                    <span style={{ fontSize: 18 }}>
                      {brands.length > 0 ? (
                        brands.map((brand) => (
                          <div
                            style={{
                              textAlign: "center",
                            }}
                          >
                            <Image
                              src={brand.imageURL}
                              style={{ width: 80, height: 80 }}
                            />
                            <p key={brand._id}>{brand.title}</p>
                          </div>
                        ))
                      ) : (
                        <span>Loading brand...</span>
                      )}
                    </span>
                  </Space>

                  <br />

                  <Space>
                    <span style={{ fontSize: 20 }}>Categories: </span>

                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <span style={{ fontSize: 18 }} key={category._id}>
                          {category.title},{" "}
                        </span>
                      ))
                    ) : (
                      <span>Loading categories...</span>
                    )}
                  </Space>
                </Col>
              </Row>
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
