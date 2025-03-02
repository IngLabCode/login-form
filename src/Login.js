import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginRegister.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [logformData, setlogformData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const LoghandleChange = (e) => {
    setlogformData({ ...logformData, [e.target.name]: e.target.value });
  };

  const loghandleSubmit = async (e) => {
    e.preventDefault();

    if (!logformData.email || !logformData.password) {
      setMessage("Zəhmət olmasa email və şifrəni daxil edin!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8081/api/v1/auth/authenticate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(logformData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Daxil ol uğurlu!");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setMessage(data.message || "İstifadəçi tapılmadı.");
      }
    } catch (error) {
      setMessage("Bağlantı xətası! Zəhmət olmasa internet bağlantınızı yoxlayın.");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form">
        <h2 style={{ color: "#007bff" }}>Daxil ol</h2>
          {message && (
            <p style={{ color: message.includes("uğurlu") ? "green" : "red", fontWeight: "bold" }}>
              {message}
            </p>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={logformData.email}
            onChange={LoghandleChange}
            required
          />
          <div style={{ position: "relative", width: "100%", marginBottom: "10px" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Şifrə"
              value={logformData.password}
              onChange={LoghandleChange}
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
          <p style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              style={{ color: "#007bff", cursor: "pointer" }}
              onClick={() => navigate("/forgot-password")}
            >
              Şifrəni unutdun?
            </span>
            <span
              style={{ color: "#007bff", cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Yeni istifadəçi?
            </span>
          </p>
          <button onClick={loghandleSubmit}>Təsdiq et</button>
        </div>
      </div>
    </div>
  );
};

export default Login;