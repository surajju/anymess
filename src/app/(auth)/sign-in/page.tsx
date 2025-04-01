'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, User, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { signInSchema } from '@/schemas/signInSchema';
import { login } from '@/actions/auth';
import { SignInBtn } from '@/components/OauthButton';

export default function SignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const response = await login(data);
    if (response?.type === 'error') {
      toast.error(response.message);
      setIsSubmitting(false);
    } else {
      toast.success('Logged in successfully');
      router.replace('/dashboard');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 to-blue-800">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-2xl transition-all duration-300 hover:shadow-blue-500/20 md:p-10">
        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-blue-500/10"></div>
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-indigo-500/10"></div>
        
        <div className="relative z-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <User size={28} className="animate-pulse" />
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent lg:text-5xl">
            True Feedback
          </h1>
          <p className="mb-8 text-gray-600">Sign in to continue your secret conversations</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700">Email/Username</FormLabel>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <User size={16} />
                    </div>
                    <Input 
                      {...field} 
                      className="pl-10 rounded-lg border-gray-300 bg-gray-50 transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200" 
                      placeholder="Enter your email or username"
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
                      <Lock size={16} />
                    </div>
                    <Input 
                      type="password" 
                      {...field} 
                      className="pl-10 rounded-lg border-gray-300 bg-gray-50 transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200" 
                      placeholder="Enter your password"
                    />
                  </div>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="group w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In
                  </>
                ) : (
                  <span className="flex items-center justify-center">
                    Sign In 
                    <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Not a member yet?{' '}
            <Link href="/sign-up" className="font-medium text-blue-600 transition-colors hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
        
        <div className="mt-8">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative bg-white px-4 text-sm text-gray-500">
              Or continue with
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-center">
            <SignInBtn />
          </div>
        </div>
      </div>
    </div>
  );
}