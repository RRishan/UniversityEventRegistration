import React, { useState } from "react";
import { register } from "../services/auth"; // see service below
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate?.() ?? (() => {});
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm password";
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setServerMsg("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerMsg("");
    if (!validate()) return;

    setLoading(true);
    try {
      // send both password and confirmPassword as backend tests expect confirmPassword field present
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      };

      const res = await register(payload);

      // typical backend response patterns:
      // - if OTP required: { success: true, otpRequired: true, message: "OTP sent to email" }
      // - if registration successful without OTP: { success: true, message: "Welcome" }
      if (res?.data?.otpRequired) {
        setServerMsg(res.data.message || "OTP sent. Check your email.");
        // optionally redirect to OTP page if you have one:
        // navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
      } else if (res?.data?.success) {
        setServerMsg(res.data.message || "Registration successful. Please log in.");
        // redirect to login after short delay:
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setServerMsg(res?.data?.message || "Registration failed.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Network error. Please try again.";
      setServerMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page" style={{ maxWidth: 520, margin: "1.5rem auto" }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit} noValidate>
        <div className="form-row">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={onChange}
            required
          />
          {errors.firstName && <div className="error">{errors.firstName}</div>}
        </div>

        <div className="form-row">
          <label htmlFor="lastName">Last name</label>
          <input id="lastName" name="lastName" value={form.lastName} onChange={onChange} required />
          {errors.lastName && <div className="error">{errors.lastName}</div>}
        </div>

        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
            minLength={6}
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>

        <div className="form-row">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={onChange}
            required
            minLength={6}
            aria-describedby="confirmHelp"
          />
          {errors.confirmPassword && (
            <div className="error" id="confirmHelp">
              {errors.confirmPassword}
            </div>
          )}
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </div>

        {serverMsg && (
          <div style={{ marginTop: 12 }}>
            <strong>{serverMsg}</strong>
          </div>
        )}
      </form>
    </div>
  );
}