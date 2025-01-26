import { Modal } from "antd";
import React, { useEffect, useState } from "react";

const BasicModal = ({ title, isModalOpen, handleOk, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [isModalOpen]);

  return (
    <Modal
      title={title}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      loading={loading}
    ></Modal>
  );
};

export default BasicModal;
