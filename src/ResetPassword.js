import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import "./ResetPassword.css";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail); 
    } else {
      setMessage("⚠ Email tapılmadı. Zəhmət olmasa, yenidən cəhd edin.");
      setTimeout(() => navigate("/forgot-password"), 3000); 
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (formData.otp.length !== 6) {
      setMessage("⚠ OTP 6 simvol olmalıdır!");
      setIsSubmitting(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("⚠ Şifrələr uyğun gəlmir!");
      setIsSubmitting(false);
      return;
    }

    if (formData.newPassword.length < 8 || formData.newPassword.length > 20) {
      setMessage("⚠ Şifrə 8 ilə 20 simvol arasında olmalıdır!");
      setIsSubmitting(false);
      return;
    }

    const resetPayload = {
      email,
      otp: formData.otp,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    };

    try {
      const response = await fetch("http://localhost:8081/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetPayload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Şifrə uğurla yeniləndi!");
        localStorage.removeItem("userEmail");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(`❌ ${data.message || "Xəta baş verdi. Yenidən cəhd edin."}`);
      }
    } catch (error) {
      console.error("Xəta:", error);
      setMessage("❌ Bağlantı xətası! Zəhmət olmasa internet bağlantınızı yoxlayın.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ color: "#007bff" }}>Şifrəni Yenilə</h2>
      {message && (
        <p className={message.includes("✅") ? "message success" : "message error"}>
          {message}
        </p>
      )}
      {email && <p className="email-display">Email: {email}</p>}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="otp"
          placeholder="OTP kodunu daxil edin"
          value={formData.otp}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) {
              handleChange(e);
            }
          }}
          maxLength={6}
          required
        />
        <div style={{ position: "relative", width: "100%", marginBottom: "10px" }}>
          <input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            placeholder="Yeni şifrə"
            value={formData.newPassword}
            onChange={handleChange}
            required
            style={{ width: "100%", paddingRight: "30px", boxSizing: "border-box" }}
          />
          <span
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </span>
        </div>
        <div style={{ position: "relative", width: "100%", marginBottom: "10px" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Yeni şifrəni təkrar daxil edin"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{ width: "100%", paddingRight: "30px", boxSizing: "border-box" }}
          />
          <span
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
          </span>
        </div>
        <button type="submit" disabled={isSubmitting} className="primary-button">
          {isSubmitting ? "Emal edilir..." : "Şifrəni Yenilə"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;