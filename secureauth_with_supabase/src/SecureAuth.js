/**
 * SecureAuth.js
 *
 * SecureAuth Authentication Container — React + Supabase.
 * Features: Registration, Login, Session Management, Password Reset.
 *
 * ============================ SUPABASE SETUP INSTRUCTIONS ============================
 * 1. This frontend expects the following .env vars (already present):
 *       REACT_APP_SUPABASE_URL=...
 *       REACT_APP_SUPABASE_ANON_KEY=...
 *    These are used in src/supabaseClient.js for connecting to your Supabase project.
 *
 * 2. Supabase Auth: Default Auth Users table is automatically managed by Supabase.
 *    You do NOT need to create a users table for authentication.
 *
 * 3. If you want to store extra user profile data (like full name, avatar), on the Supabase dashboard:
 *    - Go to Table Editor and create a new public table, named `profiles`.
 *    - Use the SQL below to create the recommended 'profiles' table/schema:
 *
 *      -- SQL to create `profiles` table linked to Supabase Auth
 *      create table public.profiles (
 *          id uuid primary key references auth.users(id) on delete cascade,
 *          email text,
 *          full_name text,
 *          avatar_url text,
 *          updated_at timestamp with time zone default timezone('utc'::text, now())
 *      );
 *
 *    - Make sure to enable Row Level Security and add a policy so users
 *      can read/update only their own profile:
 *
 *      -- Select policy (read only own)
 *      create policy "Users can read their profile." on public.profiles
 *      for select using (auth.uid() = id);
 *      -- Update policy (update only own)
 *      create policy "Users can update their own profile." on public.profiles
 *      for update using (auth.uid() = id);
 *
 * 4. Email templates, Password Reset, and all Auth Email features can be configured at:
 *      Supabase > Authentication > Email Templates.
 *
 * (See Supabase docs for details if you want to extend user data.)
 * ======================================================================================
 */

import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

// PUBLIC_INTERFACE
function SecureAuth() {
  const [tab, setTab] = useState("login"); // 'login', 'register', 'reset'
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" }); // type: 'error' | 'success'
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  // Track session on load and changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // PUBLIC_INTERFACE
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const { email, password, full_name } = form;
    if (!email || !password) {
      setLoading(false);
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }
    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name }, // sends to user_metadata
      },
    });
    if (error) {
      setLoading(false);
      setMessage({ type: "error", text: error.message });
    } else {
      setLoading(false);
      setMessage({
        type: "success",
        text:
          "Registration successful! Please check your email for a confirmation link before logging in.",
      });
      setTab("login");
      setForm({ email: "", password: "", full_name: "" });
    }
  };

  // PUBLIC_INTERFACE
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const { email, password } = form;
    if (!email || !password) {
      setLoading(false);
      setMessage({ type: "error", text: "Both email and password are required." });
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setLoading(false);
      setMessage({ type: "error", text: error.message });
    } else {
      setLoading(false);
      setMessage({ type: "success", text: "Login successful!" });
      setForm({ email: "", password: "", full_name: "" });
      // session will be updated by onAuthStateChange
    }
  };

  // PUBLIC_INTERFACE
  const handleSignOut = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Logged out." });
    }
  };

  // PUBLIC_INTERFACE
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    const { email } = form;
    if (!email) {
      setLoading(false);
      setMessage({ type: "error", text: "Please enter your email." });
      return;
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({
        type: "success",
        text: "Password reset link sent! Check your email.",
      });
      setTab("login");
      setForm({ email: "", password: "", full_name: "" });
    }
  };

  // Colors (from container request)
  const primary = "#3B82F6";
  const secondary = "#F3F4F6";
  const accent = "#10B981";

  // Card styles
  const cardStyle = {
    background: secondary,
    color: "#222",
    maxWidth: 368,
    margin: "60px auto",
    padding: "32px 28px",
    borderRadius: 16,
    boxShadow: "0 4px 32px rgba(51, 72, 120, .09)",
    display: "block",
  };
  const tabStyle = (active) => ({
    flex: 1,
    padding: "10px",
    border: "none",
    borderBottom: active
      ? `3px solid ${primary}`
      : "3px solid transparent",
    background: "none",
    fontWeight: active ? 700 : 500,
    fontSize: 18,
    color: active ? primary : "#444",
    cursor: "pointer",
    outline: "none",
    transition: "border-bottom-color .2s",
  });

  // Fields styling
  const baseInput = {
    width: "100%",
    margin: "8px 0 18px",
    padding: "10px 8px",
    borderRadius: 6,
    border: "1px solid #e3e9f1",
    fontSize: 16,
    background: "#fff",
  };

  // Button
  const buttonStyle = {
    background: primary,
    color: "#fff",
    fontWeight: 600,
    border: "none",
    borderRadius: 6,
    padding: "12px 0",
    fontSize: 17,
    cursor: "pointer",
    width: "100%",
    marginBottom: 2,
    marginTop: 4,
    transition: "background .17s",
    boxShadow: "0 2px 12px rgba(59, 130, 246, 0.08)",
  };

  // Message
  const msgStyle = (type) => ({
    color: type === "error" ? "#d03346" : accent,
    background: type === "error" ? "#ffe3e3" : "#eefff5",
    border: `1.5px solid ${type === "error" ? "#d03346" : accent}`,
    fontSize: 15,
    borderRadius: 6,
    padding: "10px",
    textAlign: "center",
    marginBottom: 18,
    marginTop: 4,
    minHeight: "20px"
  });

  // Public interface renders either session UI or auth forms
  if (session && session.user) {
    // You could fetch/use 'profiles' here for user info if created.
    return (
      <div style={cardStyle}>
        <h2 style={{ fontWeight: 700, marginBottom: 12, color: primary }}>
          Welcome, {session.user.email}
        </h2>
        <p style={{ color: "#444", fontSize: 16, marginBottom: 18 }}>
          You are logged in.<br />Session ID: <code>{session.user.id}</code>
        </p>
        <button
          style={{ ...buttonStyle, background: accent, marginBottom: 0 }}
          onClick={handleSignOut}
          disabled={loading}
        >
          {loading ? "Logging out..." : "Sign Out"}
        </button>
        {message.text && <div style={msgStyle(message.type)}>{message.text}</div>}
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", marginBottom: 30, gap: 6 }}>
        <button
          style={tabStyle(tab === "login")}
          onClick={() => {
            setTab("login");
            setMessage({ type: "", text: "" });
          }}
        >
          Login
        </button>
        <button
          style={tabStyle(tab === "register")}
          onClick={() => {
            setTab("register");
            setMessage({ type: "", text: "" });
          }}
        >
          Register
        </button>
        <button
          style={tabStyle(tab === "reset")}
          onClick={() => {
            setTab("reset");
            setMessage({ type: "", text: "" });
          }}
        >
          Reset
        </button>
      </div>

      {tab === "login" && (
        <form onSubmit={handleSignIn} autoComplete="on">
          <input
            type="email"
            name="email"
            style={baseInput}
            placeholder="Email"
            required
            value={form.email}
            onChange={handleInputChange}
            autoComplete="email"
            spellCheck="false"
          />
          <input
            type="password"
            name="password"
            style={baseInput}
            placeholder="Password"
            required
            value={form.password}
            onChange={handleInputChange}
            autoComplete="current-password"
            spellCheck="false"
          />
          <button
            style={buttonStyle}
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div style={{ marginTop: 8, textAlign: "center", fontSize: 14 }}>
            <span
              style={{
                color: accent,
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => { setTab("reset"); setMessage({ type: "", text: "" }); }}
            >
              Forgot Password?
            </span>
          </div>
        </form>
      )}

      {tab === "register" && (
        <form onSubmit={handleSignUp} autoComplete="on">
          <input
            type="email"
            name="email"
            style={baseInput}
            placeholder="Email"
            required
            value={form.email}
            onChange={handleInputChange}
            autoComplete="email"
            spellCheck="false"
          />
          <input
            type="password"
            name="password"
            style={baseInput}
            placeholder="Password"
            required
            value={form.password}
            onChange={handleInputChange}
            autoComplete="new-password"
            spellCheck="false"
          />
          <input
            type="text"
            name="full_name"
            style={baseInput}
            placeholder="Full Name (Optional)"
            value={form.full_name}
            onChange={handleInputChange}
            autoComplete="name"
            spellCheck="false"
          />
          <button
            style={buttonStyle}
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      )}

      {tab === "reset" && (
        <form onSubmit={handleResetPassword} autoComplete="on">
          <input
            type="email"
            name="email"
            style={baseInput}
            placeholder="Enter your email to reset password"
            required
            value={form.email}
            onChange={handleInputChange}
            autoComplete="email"
            spellCheck="false"
          />
          <button
            style={buttonStyle}
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Password Reset Email"}
          </button>
        </form>
      )}

      {message.text && <div style={msgStyle(message.type)}>{message.text}</div>}
    </div>
  );
}

export default SecureAuth;
