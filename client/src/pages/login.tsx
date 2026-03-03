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
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      setLocation("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
      });
    }
  };

  const handleMicrosoftLogin = () => {
    toast({
      title: "Redirecting...",
      description: "Redirecting to Microsoft authentication.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      
      {/* Centered Logo */}
      <div className="mb-8 flex justify-center">
        <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
          <X className="w-8 h-8 text-white stroke-[3]" />
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[420px] bg-card rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/[0.02] border border-border/60 relative overflow-hidden">
        
        {/* Subtle top gradient line for extra polish */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center text-foreground font-display mb-2">
            Sign in to your account
          </h1>
          <p className="text-center text-muted-foreground text-sm">
            Enter your details below to continue
          </p>
        </div>

        {/* Custom Segmented Control for Employee / Client */}
        <div className="flex p-1 bg-slate-100 rounded-lg mb-8 relative">
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
                  <FormLabel className="text-foreground/80">Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="name@company.com" 
                      className="h-11 rounded-lg bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
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
                  <FormLabel className="text-foreground/80">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-11 rounded-lg bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary transition-all pr-10"
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
                  
                  {/* Forgot Password Link - Only for Client */}
                  {currentRole === "client" && (
                    <div className="flex justify-end pt-1">
                      <a href="#" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
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
              className="w-full h-11 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] mt-2"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="mt-8 flex items-center justify-center space-x-4">
          <div className="h-px flex-1 bg-border/80"></div>
          <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Or continue with</span>
          <div className="h-px flex-1 bg-border/80"></div>
        </div>

        <Button 
          type="button" 
          variant="outline" 
          className="w-full h-11 mt-6 rounded-lg font-medium border-slate-200 hover:bg-slate-50 text-slate-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          onClick={handleMicrosoftLogin}
        >
          <svg className="w-5 h-5" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0H0V10H10V0Z" fill="#F25022"/>
            <path d="M21 0H11V10H21V0Z" fill="#7FBA00"/>
            <path d="M10 11H0V21H10V11Z" fill="#00A4EF"/>
            <path d="M21 11H11V21H21V11Z" fill="#FFB900"/>
          </svg>
          Sign in with Microsoft
        </Button>
      </div>

      {/* Footer Help Text */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Need help? <a href="#" className="font-medium text-slate-700 hover:text-primary transition-colors underline decoration-slate-300 underline-offset-4">Contact your account manager</a>
        </p>
      </div>
      
    </div>
  );
}
