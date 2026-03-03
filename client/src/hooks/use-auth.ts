import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { LoginRequest } from "@shared/schema";
import { z } from "zod";

// Fetch current user
export function useMe() {
  return useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const res = await fetch(api.auth.me.path, { credentials: "include" });
      if (res.status === 401) {
        return null; // Not authenticated
      }
      if (!res.ok) throw new Error("Failed to fetch user");
      
      const data = await res.json();
      return api.auth.me.responses[200].parse(data);
    },
    retry: false,
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      // Validate input against schema before sending
      const validated = api.auth.login.input.parse(credentials);
      
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400 || res.status === 401) {
          const schema = res.status === 400 
            ? api.auth.login.responses[400] 
            : api.auth.login.responses[401];
            
          const errorData = await res.json();
          const parsedError = schema.parse(errorData);
          throw new Error(parsedError.message);
        }
        throw new Error("An unexpected error occurred");
      }

      const data = await res.json();
      return api.auth.login.responses[200].parse(data);
    },
    onSuccess: () => {
      // Invalidate the 'me' query to refresh auth state
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] });
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.auth.logout.path, {
        method: api.auth.logout.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to logout");
      
      const data = await res.json();
      return api.auth.logout.responses[200].parse(data);
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.me.path], null);
    },
  });
}
