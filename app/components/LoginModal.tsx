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

  const handleLogin = () => {
    setError("");

    if (!email.includes("@")) {
      setError("Invalid email");
      return;
    }

    if (password.length < 6) {
      setError("Password too short");
      return;
    }

    if (email !== "guest@gmail.com" || password !== "guest123") {
      setError("User not found");
      return;
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
        <button className="modal__close" onClick={onClose} aria-label="Close modal">
          ×
        </button>

        <h2 className="modal__title">Log in to Summarist</h2>

        <button
          className="modal__social modal__guest"
          onClick={handleGuestLogin}
        >
          <FaUser className="modal__social-icon" />
          <span className="modal__social-text">Login as a Guest</span>
        </button>

        <div className="modal__divider">
          <span>or</span>
        </div>

        <button className="modal__social modal__google">
          <span className="google__icon">
            <img src="/assets/google.png" alt="Google" />
          </span>
          <span className="modal__social-text">Login with Google</span>
        </button>

        <div className="modal__divider">
          <span>or</span>
        </div>

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

        {error && <p className="modal__error">{error}</p>}

        <button className="btn" onClick={handleLogin}>
          Login
        </button>

        <p className="modal__link">Forgot your password?</p>
        <p className="modal__link modal__signup">Don’t have an account?</p>
      </div>
    </div>
  );
};

export default LoginModal;