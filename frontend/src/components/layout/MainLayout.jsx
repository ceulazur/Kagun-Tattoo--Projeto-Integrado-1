import PropTypes from "prop-types";
import React from "react";
import MenuSideBar from "./MenuSideBar";

const MainLayout = ({ children }) => {
  return <MenuSideBar>{children}</MenuSideBar>;
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
