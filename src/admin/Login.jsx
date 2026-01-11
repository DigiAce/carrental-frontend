import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [backendStatus, setBackendStatus] = useState("unknown");
  const navigate = useNavigate();

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const checkBackendConnection = async () => {
    try {
      setBackendStatus("checking");
      const response = await fetch("http://localhost:5001/api/health");
      const data = await response.json();
      if (response.ok && data.success) setBackendStatus("connected");
      else setBackendStatus("disconnected");
    } catch (err) {
      setBackendStatus("disconnected");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Please enter both username and password");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json().catch(() => ({ error: "Invalid server response" }));
      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || { username: formData.username }));
        onLogin(data.user || { username: formData.username }, data.token);
        navigate("/admin", { replace: true });
      } else {
        setError(data.error || data.message || "Login failed");
      }
    } catch {
      setError(
        backendStatus === "disconnected"
          ? "Cannot connect to backend server."
          : "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const testCredentials = (username, password) => {
    setFormData({ username, password });
    setError("");
  };

  const getBackendStatusColor = () => {
    switch (backendStatus) {
      case "connected": return "text-blue-600";
      case "disconnected": return "text-red-500";
      case "checking": return "text-gray-500";
      default: return "text-gray-400";
    }
  };

  const getBackendStatusText = () => {
    switch (backendStatus) {
      case "connected": return "✅ Backend Connected";
      case "disconnected": return "❌ Backend Disconnected";
      case "checking": return "🔄 Checking Connection...";
      default: return "🌐 Backend Status Unknown";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-blue-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-blue-600">🚗</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Portal</h1>
          <p className="text-gray-500 text-sm">SML Car Rental Management</p>
        </div>

        {/* Backend Status */}
        <div className={`text-center mb-4 text-sm font-medium ${getBackendStatusColor()}`}>
          {getBackendStatusText()}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Admin Username"
              required
              disabled={loading}
              className="w-full bg-blue-50 text-gray-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
              disabled={loading}
              className="w-full bg-blue-50 text-gray-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-center text-sm font-medium">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || backendStatus === "disconnected"}
            className={`w-full py-3 rounded-xl text-white font-bold text-lg transition ${
              loading || backendStatus === "disconnected"
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "🚀 Admin Login"}
          </button>
        </form>

        {/* Quick Test Buttons */}
        <div className="mt-6 space-y-3">
          <div className="text-center">
            <button
              onClick={checkBackendConnection}
              disabled={loading}
              className="text-blue-600 text-sm hover:underline transition disabled:opacity-50"
            >
              🔄 Check Backend Connection
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => testCredentials("admin", "admin123")}
              disabled={loading}
              className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm hover:bg-blue-100 transition disabled:opacity-50"
            >
              Use Test Credentials
            </button>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-xs text-center">
            <strong>Demo Credentials:</strong><br />
            Username: <code className="bg-gray-100 px-1 rounded">admin</code><br />
            Password: <code className="bg-gray-100 px-1 rounded">admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
