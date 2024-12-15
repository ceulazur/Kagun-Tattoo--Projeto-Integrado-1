import PropTypes from "prop-types";
import React from "react";
import MenuSideBar from "./MenuSideBar";

const MainLayout = ({ children }) => {
  return (
    <MenuSideBar>
      <div style={{ padding: "16px" }}>{children}</div>
    </MenuSideBar>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
