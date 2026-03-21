import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { useTheme } from "../contexts/ThemeContext";
import { getToast } from "../utils/toast";
import { getConfirm, confirmPresets } from "../utils/confirm";
import { motion as Motion, AnimatePresence } from "motion/react"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function Profile() {
  const { user, profile, updateProfile, updatePassword, deleteAccount } = useAuth();
  const { theme } = useTheme();
  const Toast = getToast(theme);

  const [activeTab, setActiveTab] = useState("details");
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionPassword, setDeletionPassword] = useState("");

  // Pattern for adjusting state based on props/hooks during render (to avoid setState in effect)
  const [initializedId, setInitializedId] = useState(null);
  if (profile?.id && profile.id !== initializedId) {
    setFullName(profile.full_name || "");
    setInitializedId(profile.id);
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    const { error } = await updateProfile({ full_name: fullName });

    setIsUpdatingProfile(false);

    if (error) {
      Toast.fire({
        icon: "error",
        title: error.message || "Update Failed"
      });
    } else {
      Toast.fire({
        icon: "success",
        title: "Profile updated! ✨"
      });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return Toast.fire({
        icon: "error",
        title: "Passwords do not match"
      });
    }

    if (newPassword.length < 6) {
      return Toast.fire({
        icon: "warning",
        title: "Password too weak"
      });
    }

    setIsUpdatingPassword(true);
    const { error } = await updatePassword(newPassword);
    setIsUpdatingPassword(false);

    if (error) {
      Toast.fire({
        icon: "error",
        title: error.message || "Update Failed"
      });
    } else {
      setNewPassword("");
      setConfirmPassword("");
      Toast.fire({
        icon: "success",
        title: "Password updated! 🔒"
      });
    }
  };

  const handleDeleteAccount = () => {
    getConfirm(theme).fire({
      ...confirmPresets.deleteItem('Account'),
      title: "Are you sure?",
      text: "This will permanently delete your account and all your data. This action cannot be undone!",
      confirmButtonText: "Yes, Delete Everything",
      preConfirm: () => {
        if (!deletionPassword) {
          getConfirm(theme).showValidationMessage("Please enter your current password in the field below first.");
          return false;
        }
        return true;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsDeleting(true);
        const { error } = await deleteAccount(deletionPassword);
        setIsDeleting(false);

        if (error) {
          Toast.fire({
            icon: "error",
            title: error.message || "Deletion Failed"
          });
        }
      }
    });
  };

  const tabs = [
    { id: "details", label: "Profile Details", icon: "user" },
    { id: "security", label: "Change Password", icon: "lock" },
    { id: "delete", label: "Delete Account", icon: "delete", danger: true }
  ];

  return (
    <Layout>
      <Motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto space-y-10 pb-20"
      >
        {/* Header Section */}
        <Motion.div
          variants={item}
          className="relative overflow-hidden bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700 rounded-[3rem] p-10 text-white"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-10 translate-y-[-20px] blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <Motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full border-4 border-white/30 flex items-center justify-center p-2"
            >
              <div className="w-full h-full bg-pink-100 dark:bg-dark-border rounded-full flex items-center justify-center text-pink-500 dark:text-pink-400">
                <Icon name="user" className="w-16 h-16" />
              </div>
            </Motion.div>
            <div className="text-center md:text-left">
              <Motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-black tracking-tight mb-2"
              >
                {profile?.full_name || user?.email?.split('@')[0]}
              </Motion.h1>
              <Motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-pink-100 font-bold flex items-center justify-center md:justify-start gap-2 italic"
              >
                <Icon name="clock" className="w-4 h-4" />
                Member since {new Date(user?.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </Motion.p>
            </div>
          </div>
        </Motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <Motion.div
            variants={item}
            className="w-full lg:w-72 shrink-0 space-y-2"
          >
            {tabs.map((tab) => (
              <Motion.button
                key={tab.id}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] font-black transition-all text-left ${activeTab === tab.id
                    ? tab.danger
                      ? "bg-rose-50 dark:bg-rose-900/20 text-rose-500 border-2 border-rose-100 dark:border-rose-900/30"
                      : "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-2 border-pink-100 dark:border-pink-900/30"
                    : "text-gray-400 dark:text-dark-muted hover:bg-gray-50 dark:hover:bg-dark-card hover:text-gray-600 dark:hover:text-white border-2 border-transparent"
                  }`}
              >
                <Icon name={tab.icon} className="w-6 h-6" />
                <span className="truncate">{tab.label}</span>
                {activeTab === tab.id && (
                  <Motion.div
                    layoutId="activeIndicator"
                    className={`ml-auto w-2 h-2 rounded-full ${tab.danger ? 'bg-rose-500' : 'bg-pink-500'}`}
                  />
                )}
              </Motion.button>
            ))}
          </Motion.div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === "details" && (
                <Motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-dark-card rounded-[3.5rem] p-8 md:p-10 border border-pink-50 dark:border-dark-border"
                >
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                    <span className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-xl text-pink-500">
                      <Icon name="user" className="w-6 h-6" />
                    </span>
                    Account Details
                  </h2>

                  <form onSubmit={handleUpdateProfile} className="space-y-6 text-left">
                    <div>
                      <label className="block text-xs font-black text-gray-400 dark:text-white uppercase tracking-widest mb-2 ml-1">Email Address (Read Only)</label>
                      <div className="w-full px-6 py-4 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-2xl text-gray-400 dark:text-white/60 font-bold">
                        {user?.email}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-400 dark:text-white uppercase tracking-widest mb-2 ml-1">Full Name</label>
                      <Motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-6 py-4 bg-white dark:bg-dark-bg border border-pink-100 dark:border-dark-border rounded-2xl focus:ring-4 focus:ring-pink-50 dark:focus:ring-pink-900/10 focus:border-pink-300 transition-all font-bold text-gray-700 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none"
                      />
                    </div>

                    <Motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="w-full py-4 bg-pink-500 text-white rounded-2xl font-black tracking-tight hover:bg-pink-600 transition-all shadow-lg shadow-pink-200 dark:shadow-none disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isUpdatingProfile ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Icon name="plus" className="w-5 h-5 rotate-45" />
                      )}
                      Save Changes
                    </Motion.button>
                  </form>
                </Motion.div>
              )}

              {activeTab === "security" && (
                <Motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-dark-card rounded-[3.5rem] p-8 md:p-10 border border-pink-50 dark:border-dark-border"
                >
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                    <span className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-xl text-pink-500">
                      <Icon name="lock" className="w-6 h-6" />
                    </span>
                    Security
                  </h2>

                  <form onSubmit={handleUpdatePassword} className="space-y-6 text-left">
                    <div>
                      <label className="block text-xs font-black text-gray-400 dark:text-white uppercase tracking-widest mb-2 ml-1">New Password</label>
                      <Motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-6 py-4 bg-white dark:bg-dark-bg border border-pink-100 dark:border-dark-border rounded-2xl focus:ring-4 focus:ring-pink-50 dark:focus:ring-pink-900/10 focus:border-pink-300 transition-all font-bold text-gray-700 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-400 dark:text-white uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                      <Motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-6 py-4 bg-white dark:bg-dark-bg border border-pink-100 dark:border-dark-border rounded-2xl focus:ring-4 focus:ring-pink-50 dark:focus:ring-pink-900/10 focus:border-pink-300 transition-all font-bold text-gray-700 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none"
                      />
                    </div>

                    <Motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isUpdatingPassword}
                      className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-2xl font-black tracking-tight hover:bg-pink-700 transition-all shadow-lg shadow-pink-200 dark:shadow-none disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isUpdatingPassword ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Icon name="lock" className="w-5 h-5" />
                      )}
                      Update Password
                    </Motion.button>
                  </form>
                </Motion.div>
              )}

              {activeTab === "delete" && (
                <Motion.div
                  key="delete"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-dark-card rounded-[3.5rem] p-8 md:p-10 border border-rose-50 dark:border-rose-900/20"
                >
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <span className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-xl text-rose-500">
                      <Icon name="delete" className="w-6 h-6" />
                    </span>
                    Danger Zone
                  </h2>
                  <p className="text-gray-500 dark:text-dark-muted font-bold mb-8">
                    Deleting your account will permanently remove all your transaction history, account details, and preferences. This action cannot be undone.
                  </p>

                  <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-3xl p-6 mb-8">
                    <p className="text-rose-600 dark:text-rose-400 text-sm font-black uppercase tracking-widest mb-1">Warning</p>
                    <p className="text-rose-500 dark:text-rose-300/80 text-xs font-bold leading-relaxed">
                      All data associated with {user?.email} will be erased from our servers immediately upon confirmation.
                    </p>
                  </div>

                  <div className="mb-8 space-y-4">
                    <label className="block text-xs font-black text-rose-500 dark:text-rose-400 uppercase tracking-widest ml-1">Confirm Identity with Password</label>
                    <Motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="password"
                      value={deletionPassword}
                      onChange={(e) => setDeletionPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="w-full px-6 py-4 bg-white dark:bg-dark-bg border border-rose-100 dark:border-dark-border rounded-2xl focus:ring-4 focus:ring-rose-50 dark:focus:ring-rose-900/10 focus:border-rose-300 transition-all font-bold text-gray-700 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none"
                    />
                  </div>

                  <Motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black tracking-tight hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 dark:shadow-none disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Icon name="delete" className="w-5 h-5" />
                    )}
                    Permanently Delete Account
                  </Motion.button>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Motion.div>
    </Layout>
  );
}
