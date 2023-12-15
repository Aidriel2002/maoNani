// Modal.js

import React from "react";
import "./modal.css";

const Modal = ({ onClose, children,darkMode }) => {
  
  return (

    <div className="modal-overlay" id={darkMode ? 'dark-mode' : 'light-mode'} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        {children}
        {darkMode}
        
      </div>
    </div>
  );
};

export default Modal;