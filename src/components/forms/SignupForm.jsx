"use client";
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import Session from "@/app/context/sessionContext";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(20, { message: "Password must be at most 20 characters long" });
const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
const SignupForm = () => {
  const { toast } = useToast();
  const router = useRouter();

  const { isActive, dispatch } = useContext(Session);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    console.log(values);
    try {
      const response = await fetch("/api/account/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        console.log("account created successfully");
        dispatch({ type: "ACTIVE" });
        router.push("/");
      } else {
        console.error("Failed to create account");
        const data = await response.json();
        toast({
          title: "Uh oh! Something went wrong.",
          description: data.message,
        });
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with the server",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-3 border p-3 min-w-[30vw] rounded-md'
      >
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='JohnDoe' {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input type='password' placeholder='*******' {...field} />
              </FormControl>
              <FormDescription>Choose a secure password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Passowrd</FormLabel>
              <FormControl>
                <Input type='password' placeholder='*******' {...field} />
              </FormControl>
              <FormDescription>Enter the same Password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mr-auto' type='submit'>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
