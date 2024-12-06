import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("1234");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setTimeout(() => navigate("/quotes"), 2000); // Redirect after 2 seconds
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await fetch("https://assignment.stage.crafto.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, otp }),
      });

      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/quotes");
      } else {
        alert("Invalid login credentials.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-0">
      {isLoggedIn ? (
        <div className="p-8 bg-white rounded shadow-md w-full max-w-sm sm:w-96">
          <h2 className="mb-4 text-xl font-bold text-center text-green-500">
            You are already logged in.
          </h2>
          <p className="text-center text-gray-600">
            Redirecting to the quotes page...
          </p>
        </div>
      ) : (
        <div className="p-8 bg-white rounded shadow-md w-full max-w-sm sm:w-96">
          <h2 className="mb-4 text-xl font-bold text-center">Login</h2>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-4 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="OTP"
            className="w-full p-2 mb-4 border rounded"
            value={otp}
            disabled
          />
          <button
            onClick={handleLogin}
            className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            disabled={username === ""}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
