"use client";
import { FC } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: FC<LoginModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal__overlay">
      <div className="modal">
        <button className="modal__close" onClick={onClose}>
          X
        </button>

        <h2>Login</h2>

        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />

        <button className="btn">Login</button>
      </div>
    </div>
  );
};

export default LoginModal;