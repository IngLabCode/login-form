import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginRegister.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [regformData, setRegFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({}); 
  const navigate = useNavigate();

  const ReghandleChange = (e) => {
    setRegFormData({ ...regformData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!regformData.name.trim()) {
      newErrors.name = "Ad boş ola bilməz.";
    }
    if (!regformData.phone.trim()) {
      newErrors.phone = "Telefon nömrəsi boş ola bilməz.";
    } else if (!/^\+[1-9]\d{1,14}$/.test(regformData.phone)) {
      newErrors.phone = "Telefon nömrəsi beynəlxalq formatda olmalıdır (məsələn, +994507330265).";
    }
    if (!regformData.email.trim()) {
      newErrors.email = "Email boş ola bilməz.";
    } else if (!/\S+@\S+\.\S+/.test(regformData.email)) {
      newErrors.email = "Email düzgün formatda deyil.";
    }
    if (!regformData.password.trim()) {
      newErrors.password = "Şifrə boş ola bilməz.";
    } else if (regformData.password.length < 8) {
      newErrors.password = "Şifrə ən azı 8 simvoldan ibarət olmalıdır.";
    } else if (regformData.password.length > 20) {
      newErrors.password = "Şifrə ən çox 20 simvoldan ibarət olmalıdır.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  const ReghandleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regformData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Qeydiyyat uğurlu!");
        setRegFormData({ name: "", phone: "", email: "", password: "" }); 
      } else {
        if (data.message && data.message.includes("email") &&
            (data.message.includes("already exists") ||
             data.message.includes("duplicate") ||
             data.message.includes("unique constraint"))) {
          setMessage("Bu email artıq qeydiyyatdan keçib.");
        } else {
          setMessage(data.message || "Xəta baş verdi.");
        }
      }
    } catch (error) {
      setMessage("Server ilə əlaqə yaratmaq mümkün olmadı.");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form">
          <h2 style={{ color: "#007bff" }}>Qeydiyyat Formu</h2>
          {message && (
            <p style={{ color: message.includes("uğurlu") ? "green" : "red", fontWeight: "bold" }}>
              {message}
            </p>
          )}
          <input
            type="text"
            name="name"
            placeholder="Ad"
            value={regformData.name}
            onChange={ReghandleChange}
            required
          />
          {errors.name && <p style={{ color: "red", fontSize: "0.9rem" }}>{errors.name}</p>}
          <input
            type="text"
            name="phone"
            placeholder="Telefon nömrəsi"
            value={regformData.phone}
            onChange={ReghandleChange}
            required
          />
          {errors.phone && <p style={{ color: "red", fontSize: "0.9rem" }}>{errors.phone}</p>}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={regformData.email}
            onChange={ReghandleChange}
            required
          />
          {errors.email && <p style={{ color: "red", fontSize: "0.9rem" }}>{errors.email}</p>}
          <div style={{ position: "relative", width: "100%", marginBottom: "10px" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Şifrə"
              value={regformData.password}
              onChange={ReghandleChange}
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
          {errors.password && <p style={{ color: "red", fontSize: "0.9rem" }}>{errors.password}</p>}
          <button onClick={ReghandleSubmit}>Təsdiq et</button>
          <p>
            Artıq hesabınız var?{" "}
            <span style={{ color: "#007bff", cursor: "pointer" }} onClick={() => navigate("/login")}>
              Daxil olun
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;