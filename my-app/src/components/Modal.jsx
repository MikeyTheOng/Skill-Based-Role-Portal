import React, { useState, useRef, useEffect } from "react";
import {MdOutlineCancel} from 'react-icons/md';

function Modal({className, show, onClose, children}) {
  const styles = {
    container:
        `fixed
        top-1/2
        bottom-1/2
        left-1/2
        right-1/2
        -translate-x-1/2
        -translate-y-1/2
        bg-slate-50
        shadow-lg
        shadow-gray-300
        border
        border-slate-200
        rounded-md
        transition-all
        duration-300
        ease-in-out
        px-8
        pt-12
        pb-8`
  }

  const modal = useRef(null);

  const checkClick = (event) => {
    if (show && modal.current && !modal.current.contains(event.target) ) {
      onClose();
    }
  };

  useEffect(() => {
    if (show) {
        setTimeout(() => {
            document.addEventListener('click', checkClick);
        },100);
    }
    return () => {
      document.removeEventListener('click', checkClick);
    };
  }, [show]);
  
  return (
    <div ref={modal} className={`${styles.container} ${className} ${ show ? 'opacity-1 visible' : 'opacity-0 invisible' }`}>
      <button className="absolute right-4 top-4 hover:text-gray-400" onClick={onClose}>
        <MdOutlineCancel className="text-slate-600" />
      </button>
      {children}
    </div>
  );
}

export default Modal;