import React from 'react';
import { Layout, Menu, Breadcrumb, Button, Modal } from 'antd';
import { UserOutlined, UploadOutlined, DesktopOutlined, AuditOutlined } from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedKey = location.pathname.split('/')[1] || 'approvals';

  const logout = () => {
    Modal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to logout?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        localStorage.removeItem('token');
        navigate('/login');
      },
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div
          className="logo"
          style={{ color: 'white', padding: 16, textAlign: 'center', fontSize: 18, fontWeight: 700 }}
        >
          MIS Admin
        </div>
        <Menu theme="dark" selectedKeys={[selectedKey]} mode="inline">
          <Menu.Item key="approvals" icon={<DesktopOutlined />}>
            <Link to="/approvals">Approvals</Link>
          </Menu.Item>
          <Menu.Item key="teachers" icon={<UserOutlined />}>
            <Link to="/teachers">Teachers</Link>
          </Menu.Item>
          <Menu.Item key="students" icon={<UserOutlined />}>
            <Link to="/students">Students</Link>
          </Menu.Item>
          <Menu.Item key="upload" icon={<UploadOutlined />}>
            <Link to="/upload">Upload</Link>
          </Menu.Item>
          <Menu.Item key="audit" icon={<AuditOutlined />}>
            <Link to="/audit">Audit</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', display: 'flex', justifyContent: 'flex-end', paddingRight: 24 }}>
          <Button type="primary" onClick={logout}>
            Logout
          </Button>
        </Header>
        <Content style={{ margin: '16px' }}>
          <Breadcrumb style={{ marginBottom: 16 }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>{selectedKey.charAt(0).toUpperCase() + selectedKey.slice(1)}</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>MIS Admin ©2025</Footer>
      </Layout>
    </Layout>
  );
}
