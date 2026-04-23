import { create } from "zustand";
import axios from "axios";

export const useAuth = create((set) => ({
  currentUser: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  isAuthenticated: false,
  error: null,

  login: async (userCredWithRole) => {
    const { role, ...userCredObj } = userCredWithRole;
    try {
      set({ loading: true, error: null });
      let res = await axios.post(
        "https://mern-week-9-10.onrender.com/common-api/login",
        userCredObj,
        { withCredentials: true }
      );

      const { token, user } = res.data.payload;

      // ← CHANGED: store token fields to match what verifyToken decoded gives
      const currentUser = {
        userId: user._id,       // ← map _id to userId
        role: user.role,
        email: user.email,
        firstName: user.firstName,
        profileImageUrl: user.profileImageUrl,
      };

      localStorage.setItem("token", token);

      set({
        loading: false,
        isAuthenticated: true,
        currentUser,            // ← consistent structure
        token,
      });
    } catch (err) {
      console.log("err is ", err);
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Login failed",
      });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      await axios.get(
        "https://mern-week-9-10.onrender.com/common-api/logout",
        { withCredentials: true }
      );
      localStorage.removeItem("token");
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        token: null,
      });
    } catch (err) {
      localStorage.removeItem("token");
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        token: null,
        error: err.response?.data?.error || "Logout failed",
      });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) return set({ loading: false, isAuthenticated: false });
    try {
      set({ loading: true });
      const res = await axios.get(
        "https://mern-week-9-10.onrender.com/common-api/check-auth",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // res.data.payload = decoded token = { userId, role, email }
      set({
        currentUser: res.data.payload, // ← already has userId, role, email
        isAuthenticated: true,
        loading: false,
        token,
      });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
          token: null,
        });
        return;
      }
      console.error("Auth check failed:", err);
      set({ loading: false });
    }
  },
}));