"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthCardWrapper } from "./auth-card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginSchema } from "@/schemas/auth-schemas";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useMutation } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { toast } from "sonner";

export const LoginForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof LoginSchema>) =>
      fetcher({ url: "/auth/login", data: values, method: "POST" }),
    onSuccess: (data: any) => {
      setSuccess("Login successful! Redirecting...");
      router.push(data.url as string);
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error(`Error: ${error.message}`);
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    loginMutation(values);
  };

  return (
    <AuthCardWrapper headerLabel="Welcome to Admin Dashboard">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="user123"
                      type="text"
                      autoComplete="admin"
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
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="******"
                      type="password"
                      disabled={isPending}
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
    </AuthCardWrapper>
  );
};
