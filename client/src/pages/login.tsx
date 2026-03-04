import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginRequest } from "@shared/schema";
import { useLogin, useMe } from "@/hooks/use-auth";
import { useLocation, Redirect } from "wouter";
import { Eye, EyeOff, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Check if already logged in
  const { data: user, isLoading: isLoadingUser } = useMe();

  const loginMutation = useLogin();

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "employee",
    },
  });

  // Watch role to conditionally show forgot password and update UI
  const currentRole = form.watch("role");

  // If already authenticated, redirect to dashboard
  if (user && !isLoadingUser) {
    return <Redirect to="/dashboard" />;
  }

  const onSubmit = async (values: LoginRequest) => {
    try {
      await loginMutation.mutateAsync(values);
      setLocation("/dashboard");
    } catch (error) {
      // Error is handled in the UI now
    }
  };

  const handleMicrosoftLogin = () => {
    toast({
      title: "Redirecting...",
      description: "Redirecting to Microsoft authentication.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
      {/* Centered Logo */}
      <div className="mb-8 flex justify-center">
        <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
          <X className="w-8 h-8 text-white stroke-[3]" />
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[420px] bg-card rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/[0.02] border border-border/60 relative overflow-hidden">
        {/* Subtle top gradient line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 font-display mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm">
            Sign in to access your account
          </p>
        </div>

        {/* Error Message */}
        {loginMutation.isError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="mt-0.5">
              <svg
                className="w-5 h-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-sm text-red-800 leading-tight">
              Invalid {currentRole} credentials. Please check your email and password.
            </p>
          </div>
        )}

        {/* Employee / Client Toggle */}
        <div className="flex p-1 bg-slate-50 border border-slate-200 rounded-lg mb-8 relative">
          <button
            type="button"
            onClick={() => form.setValue("role", "employee")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 z-10 ${
              currentRole === "employee"
                ? "bg-slate-800 text-white shadow-md"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Employee
          </button>
          <button
            type="button"
            onClick={() => form.setValue("role", "client")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 z-10 ${
              currentRole === "client"
                ? "bg-slate-800 text-white shadow-md"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Client
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-600 font-medium">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="h-12 rounded-lg bg-white border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-600 font-medium">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-12 rounded-lg bg-white border-slate-200 pr-10 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  {currentRole === "client" && (
                    <div className="flex justify-end pt-1">
                      <a
                        href="#"
                        className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        Forgot your password?
                      </a>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg font-semibold shadow-md shadow-blue-500/10 transition-all active:scale-[0.98] mt-2"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="mt-8 flex items-center justify-center space-x-4">
          <div className="h-px flex-1 bg-border/80"></div>
          <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-border/80"></div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-12 mt-6 rounded-lg font-medium border-slate-200 hover:bg-slate-50 text-slate-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          onClick={handleMicrosoftLogin}
        >
          <svg className="w-5 h-5" viewBox="0 0 21 21">
            <path d="M10 0H0V10H10V0Z" fill="#F25022" />
            <path d="M21 0H11V10H21V0Z" fill="#7FBA00" />
            <path d="M10 11H0V21H10V11Z" fill="#00A4EF" />
            <path d="M21 11H11V21H21V11Z" fill="#FFB900" />
          </svg>
          Sign in with Microsoft
        </Button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Need help?{" "}
          <a
            href="#"
            className="font-medium text-slate-700 hover:text-primary transition-colors underline decoration-slate-300 underline-offset-4"
          >
            Contact your account manager
          </a>
        </p>
      </div>
    </div>
  );
}
