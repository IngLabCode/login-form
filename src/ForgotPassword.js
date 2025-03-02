import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Zəhmət olmasa email ünvanınızı daxil edin.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("Düzgün email ünvanı daxil edin.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8081/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ OTP kodu email ünvanınıza göndərildi.");
        localStorage.setItem("userEmail", email); 
        setTimeout(() => navigate("/reset-password"), 2000); 
      } else {
        setMessage(data.message || "Xəta baş verdi. Yenidən cəhd edin.");
      }
    } catch (error) {
      setMessage("Bağlantı xətası! Zəhmət olmasa internet bağlantınızı yoxlayın.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ color: "#007bff" }}>Şifrəni Unutdum</h2>
      {message && (
        <p className={message.includes("✅") ? "message success" : "message error"}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          name="email"
          placeholder="Email ünvanınızı daxil edin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={isSubmitting} className="primary-button">
          {isSubmitting ? "Göndərilir..." : "OTP Göndər"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;