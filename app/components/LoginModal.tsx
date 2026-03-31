"use client";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  // 🔐 LOGIN LOGIC
  const handleLogin = () => {
    setError("");

    if (!email.includes("@")) {
      return setError("Invalid email");
    }

    if (password.length < 6) {
      return setError("Password too short");
    }

    if (email !== "guest@gmail.com" || password !== "guest123") {
      return setError("User not found");
    }

    router.push("/for-you");
    onClose();
  };

  const handleGuestLogin = () => {
    router.push("/for-you");
    onClose();
  };

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="modal__header">
          <h2 className="modal__title">Log in to Summarist</h2>
          <button className="modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* GUEST LOGIN */}
        <button
          className="modal__social modal__guest"
          onClick={handleGuestLogin}
        >
          <FaUser /> Login as a Guest
        </button>

        {/* DIVIDER */}
        <div className="modal__divider">
          <span>or</span>
        </div>

        {/* GOOGLE */}
        <button className="modal__social modal__google">
        <span className="google__icon">
        <img src="/assets/google.png" alt="google" />
          </span>
            Login with Google
        </button>

        {/* DIVIDER */}
        <div className="modal__divider">
          <span>or</span>
        </div>

        {/* INPUTS */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ERROR */}
        {error && <p className="modal__error">{error}</p>}

        {/* LOGIN */}
        <button className="btn" onClick={handleLogin}>
          Login
        </button>

        {/* FOOTER */}
        <p className="modal__link">Forgot your password?</p>
        <p className="modal__link modal__signup">
          Don’t have an account?
        </p>

      </div>
    </div>
  );
};

export default LoginModal;