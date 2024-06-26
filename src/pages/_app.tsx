import SiderComponent from "@/components/SiderComponent";
import { Layout } from "antd";
import type { AppProps } from "next/app";
import "../styles/globals.css";

const { Header, Sider, Content } = Layout;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Header>{/* <title>Admin Shopping</title> */}</Header>
      <Layout>
        {/* <Sider></Sider> */}
        <SiderComponent />
        <Content>
          <div className="container mt-4 p-2">
            <Component {...pageProps} />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
