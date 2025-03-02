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
    
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!email) {
      setMessage("Zəhmət olmasa emailinizi daxil edin!");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("OTP kodu emailinizə göndərildi!");
        sessionStorage.setItem("userEmail", email);
        setTimeout(() => navigate("/reset-password"), 1000);
      } else {
        setMessage(data.message || "Xəta baş verdi.");
      }
    } catch (error) {
      setMessage("Bağlantı xətası! Zəhmət olmasa internet bağlantınızı yoxlayın.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
     <h2 style={{ color: "#007bff" }}>Şifrəni Unutdun?</h2>
      {message && (
        <p style={{ color: message.includes("göndərildi") ? "green" : "red", fontWeight: "bold" }}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          placeholder="Emailinizi daxil edin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Göndərilir..." : "Göndər"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;