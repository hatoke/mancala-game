import { Fragment } from "react";

function Modal({ show, status, children }) {
  if (!show) {
    return null;
  }

  const statusList = {
    success: "",
    fail: "",
    alert: "",
  };

  return <div className="modal-body">{children}</div>;
}

export default Modal;
