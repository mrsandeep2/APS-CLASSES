import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, LogIn, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back, Admin!");
      navigate("/admin/gallery");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-secondary/30 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-8 py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-secondary mx-auto flex items-center justify-center mb-4 shadow-lg"
            >
              <GraduationCap className="w-9 h-9 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-primary-foreground font-heading">
              APS Classes
            </h1>
            <p className="text-primary-foreground/60 text-sm mt-1">By Munna Sir</p>
            <p className="text-primary-foreground/80 text-xs mt-3 italic">
              "शिक्षा ही सफलता की कुंजी है"
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="px-8 py-8 space-y-5">
            <div className="text-center mb-2">
              <h2 className="text-lg font-semibold text-foreground">Admin Login</h2>
              <p className="text-muted-foreground text-xs">Sign in to manage your dashboard</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@apsclasses.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-secondary hover:bg-secondary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </span>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Only authorized admins can access this panel
            </p>
          </form>
        </div>

        <p className="text-center text-primary-foreground/50 text-xs mt-6">
          © {new Date().getFullYear()} APS Classes. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
