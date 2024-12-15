import { ConfigProvider, Layout, Menu, message } from "antd";
import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { BsArchive, BsCalendarWeek } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

const { Sider } = Layout;

const getItem = (label, key, icon, link, children) => ({
  label: link ? <Link to={link}>{label}</Link> : label,
  key,
  icon,
  link,
  children,
});

const MenuSideBar = ({ children }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useContext(AuthContext);

  const items = [
    {
      label: "Agenda",
      key: "1",
      icon: <BsCalendarWeek size={20} />,
      link: "/agenda",
    },
    {
      label: "Materiais",
      key: "2",
      icon: <BsArchive size={20} />,
      children: [
        {
          label: "Estoque",
          key: "2-1",
          link: "/materiais/estoque",
        },
        {
          label: "Fornecedores",
          key: "2-2",
          link: "/materiais/fornecedores",
        },
      ],
    },
  ];

  const [selectedKey, setSelectedKey] = useState(() => {
    const currentItem = items.find((item) => item.link === location.pathname);
    return currentItem ? currentItem.key : "1";
  });

  useEffect(() => {
    const currentItem = items.find((item) => item.link === location.pathname);
    if (currentItem) {
      setSelectedKey(currentItem.key);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    message.success("Logout realizado com sucesso!");
    logout();
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemHoverBg: "var(--color-tertiary)",
            itemSelectedBg: "var(--color-gray)",
            itemSelectedColor: "var(--color-black)",
          },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{ position: "fixed", height: "100vh" }}
        >
          <div className="d-flex flex-column h-100">
            <div className="d-flex items-center justify-center pt-4 pb-4 w-100">
              <Link to="/" className="d-flex items-center justify-center w-100">
                <img
                  width={collapsed ? 40 : 120}
                  className="w-100 px-4"
                  src="assets/horizontal_logo.svg"
                  preview={false}
                />
              </Link>
            </div>
            <Menu
              theme="light"
              selectedKeys={[selectedKey]}
              mode="inline"
              items={items}
            />
            <div className="mt-auto text-center">
              {!collapsed && (
                <>
                  <p className="m-0">User Name</p>
                </>
              )}
              <Menu
                theme="light"
                mode="inline"
                selectable={false}
                items={[
                  {
                    label: "Logout",
                    key: "logout",
                    icon: <FiLogOut size={20} />,
                    onClick: handleLogout,
                  },
                ]}
              />
            </div>
          </div>
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>{children}</Layout>
      </Layout>
    </ConfigProvider>
  );
};

MenuSideBar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MenuSideBar;
