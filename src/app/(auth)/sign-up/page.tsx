'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, User, Mail, Key, UserPlus, CheckCircle, ArrowRight } from "lucide-react";
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import { checkUniqueEmail, saveUser } from '@/actions/auth';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debouncedUsername, setDebouncedUsername] = useState(username);

  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      name: '',
      password: '',
    },
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUsername(username);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [username]);

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await checkUniqueEmail(debouncedUsername);
          setUsernameMessage(response?.message || 'Error checking username');
        } catch (error) {
          setUsernameMessage('Error checking username');
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    const response = await saveUser(data);

    if (response?.type === 'error') {
      toast.error(response.message);
    } else {
      toast.success(response?.message);
    }
    setIsSubmitting(false);
    router.replace(`/verify/${username}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 to-blue-800 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-purple-500/10 backdrop-blur-xl"></div>
        <div className="absolute top-1/3 right-10 h-64 w-64 rounded-full bg-blue-500/10 backdrop-blur-xl"></div>
        <div className="absolute bottom-10 left-1/4 h-32 w-32 rounded-full bg-indigo-500/10 backdrop-blur-xl"></div>
      </div>

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md p-8 shadow-2xl transition-all duration-300 hover:shadow-purple-500/20 md:p-10">
        {/* Card decorative elements */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-purple-100 to-blue-100"></div>
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100"></div>
        
        <div className="relative z-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transition-transform hover:scale-105">
            <UserPlus size={28} className="animate-pulse" />
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent lg:text-5xl">
          AnyMess
          </h1>
          <p className="mb-8 text-gray-600">Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700">Username</FormLabel>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <User size={16} />
                    </div>
                    <Input
                      {...field}
                      className="pl-10 rounded-lg border-gray-300 bg-gray-50 transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                      placeholder="Choose a unique username"
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                    />
                  </div>
                  <div className="min-h-6 pl-2">
                    {isCheckingUsername && (
                      <div className="flex items-center text-gray-500">
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        <span className="text-xs">Checking availability...</span>
                      </div>
                    )}
                    {!isCheckingUsername && usernameMessage && (
                      <p
                        className={`flex items-center text-xs ${
                          usernameMessage !== 'Username already exists'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {usernameMessage !== 'Username already exists' && <CheckCircle className="mr-1 h-3 w-3" />}
                        {usernameMessage}
                      </p>
                    )}
                  </div>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Mail size={16} />
                    </div>
                    <Input 
                      {...field} 
                      name="email" 
                      className="pl-10 rounded-lg border-gray-300 bg-gray-50 transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700">Name</FormLabel>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <User size={16} />
                    </div>
                    <Input 
                      {...field} 
                      name="name" 
                      className="pl-10 rounded-lg border-gray-300 bg-gray-50 transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <Key size={16} />
                    </div>
                    <Input 
                      type="password" 
                      {...field} 
                      name="password" 
                      className="pl-10 rounded-lg border-gray-300 bg-gray-50 transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                      placeholder="Create a secure password"
                    />
                  </div>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 py-2.5 text-sm font-medium text-white transition-all hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-300" 
                disabled={isSubmitting}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account
                    </>
                  ) : (
                    <>
                      Sign Up
                      <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </Button>
            </div>
          </form>
        </Form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already a member?{' '}
            <Link href="/sign-in" className="font-medium text-purple-600 transition-colors hover:text-purple-800">
              Sign in
            </Link>
          </p>
        </div>
        
        {/* Privacy note */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Your privacy is our priority. All feedback remains anonymous.</p>
        </div>
      </div>
    </div>
  );
}