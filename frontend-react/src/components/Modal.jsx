import "../assets/style/components/Modal.scss";

function Modal({ show, setShow, overlay, status, headText, children }) {
  if (!show) {
    return null;
  }

  const statusList = {
    success: "",
    fail: "",
    alert: "",
  };

  const closeModal = () => {
    if (overlay) {
      setShow();
    }
  };

  return (
    <div className="modal-component">
      <div className="modal-wrapper" onClick={closeModal}></div>
      <div className="modal">
        {headText && headText.length > 0 && (
          <div className="modal-head">
            <span>{headText}</span>
            <div className="modal-close">
              <div className="cross" onClick={closeModal}></div>
            </div>
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
