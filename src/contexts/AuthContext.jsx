import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../hooks/useAuth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .single();

      if (error) {
        // PGRST116 = row not found: profile may not exist yet (DB trigger may be pending)
        if (error.code !== "PGRST116") {
          // Silent handling for now as requested
        }
      } else {
        setProfile(data);
      }
    } catch (err) {
      // Silent handling
    }
  };

  useEffect(() => {
    // Force Supabase to process the hash if it exists in the URL
    if (window.location.hash && window.location.hash.includes("access_token")) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setUser(session.user);
          fetchProfile(session.user.id);
          // Clean up the URL hash but keep the path
          window.history.replaceState(null, "", window.location.pathname);
        }
      });
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) fetchProfile(currentUser.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }

      // Always resolve loading after any auth state change, not just SIGNED_IN
      // Prevents the app from getting stuck in an indefinite loading state
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = (email, password) => supabase.auth.signUp({ email, password });

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        skipBrowserRedirect: true,
      },
    });
    return { data, error };
  };

  const signOut = () => supabase.auth.signOut();

  const resetPassword = (email) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

  const updatePassword = (password) => supabase.auth.updateUser({ password });

  const updateProfile = async (updates) => {
    if (!user) return { error: new Error("No user logged in") };

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (!error) {
      setProfile(data);
    }
    return { data, error };
  };

  const deleteAccount = async (password) => {
    if (!user) return { error: new Error("No user logged in") };
    if (!password) return { error: new Error("Password is required for deletion") };

    try {
      // 1. Re-authenticate to verify the password
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
      });

      if (reauthError) throw new Error("Incorrect password. Please try again.");

      // 2. Invoke the edge function to delete the user data and auth record
      const { data, error: functionError } = await supabase.functions.invoke('delete-user');
      
      if (functionError) throw functionError;
      
      // 3. Successfully deleted on server, now sign out locally
      await signOut();
      return { data, success: true };
    } catch (error) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        deleteAccount,
        refreshProfile: () => user && fetchProfile(user.id),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
