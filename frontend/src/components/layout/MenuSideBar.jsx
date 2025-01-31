import { Breadcrumb, ConfigProvider, Layout, Menu, message } from "antd";
import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { BsArchive, BsCalendarWeek } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

const { Sider } = Layout;

const MenuSideBar = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useContext(AuthContext);

  const [userName, setUserName] = useState("${userName}");

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

  const findSelectedKey = (pathname) => {
    for (const item of items) {
      if (item.link === pathname) {
        return item.key;
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.link === pathname) {
            return child.key;
          }
        }
      }
    }
    return "1";
  };

  const findOpenKeys = (pathname) => {
    for (const item of items) {
      if (item.children) {
        for (const child of item.children) {
          if (child.link === pathname) {
            return [item.key];
          }
        }
      }
    }
    return [];
  };

  const [selectedKey, setSelectedKey] = useState(() =>
    findSelectedKey(location.pathname)
  );
  const [openKeys, setOpenKeys] = useState(() =>
    findOpenKeys(location.pathname)
  );

  useEffect(() => {
    setSelectedKey(findSelectedKey(location.pathname));
    setOpenKeys(findOpenKeys(location.pathname));
  }, [location.pathname]);

  const handleMenuClick = ({ key }) => {
    const item = items.find(
      (item) =>
        item.key === key || item.children?.find((child) => child.key === key)
    );
    if (item) {
      const link =
        item.link || item.children?.find((child) => child.key === key)?.link;
      if (link) {
        navigate(link);
      }
    }
    setSelectedKey(key);
  };

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const handleLogout = () => {
    message.success("Logout realizado com sucesso!");
    logout();
  };

  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
  ].concat(
    pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      const isLast = index === pathSnippets.length - 1;
      return (
        <Breadcrumb.Item key={url}>
          {isLast ? (
            <span style={{ fontWeight: "semibold" }}>
              {capitalize(pathSnippets[index])}
            </span>
          ) : (
            <Link to={url}>{capitalize(pathSnippets[index])}</Link>
          )}
        </Breadcrumb.Item>
      );
    })
  );

  const getPageTitle = () => {
    const currentItem = items.find(
      (item) =>
        item.key === selectedKey ||
        item.children?.find((child) => child.key === selectedKey)
    );
    if (currentItem) {
      const childItem = currentItem.children?.find(
        (child) => child.key === selectedKey
      );
      return childItem ? childItem.label : currentItem.label;
    }
    return "Agenda";
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
              openKeys={openKeys}
              mode="inline"
              items={items}
              onClick={handleMenuClick}
              onOpenChange={handleOpenChange}
            />
            <div className="mt-auto text-center">
              {!collapsed && (
                <>
                  <p className="m-0">Olá, {userName}!</p>
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
        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
          <div className="bg-white p-3 d-flex flex-column items-center justify-between gap-3">
            <Breadcrumb>{breadcrumbItems}</Breadcrumb>
            <h3>
              Bem-vindo(a), {userName}! Aqui está seu(a) {getPageTitle()}.
            </h3>
          </div>
          {children}
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

MenuSideBar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MenuSideBar;
