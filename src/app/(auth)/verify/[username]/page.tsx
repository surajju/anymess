'use client';

import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import { verifyCode } from '@/actions/auth';
import Link from 'next/link';
import { useState } from 'react';
import { Loader2, CheckCircle, RefreshCw, Mail } from 'lucide-react';

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    }
  });
  
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await verifyCode(params.username, data.code);

      if (response.type === 'error') {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        router.replace('/sign-in');
      }
    } catch (error) {
      toast.error('An error occurred during verification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      toast.success('Verification code resent');
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-800 to-blue-800 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 h-40 w-40 rounded-full bg-teal-500/10 backdrop-blur-xl"></div>
        <div className="absolute top-1/2 left-20 h-64 w-64 rounded-full bg-blue-500/10 backdrop-blur-xl"></div>
        <div className="absolute bottom-20 right-1/3 h-48 w-48 rounded-full bg-cyan-500/10 backdrop-blur-xl"></div>
      </div>

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md p-8 shadow-2xl transition-all duration-300 hover:shadow-teal-500/20 md:p-10">
        {/* Card decorative elements */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-teal-100 to-blue-100"></div>
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-tr from-cyan-100 to-teal-100"></div>
        
        <div className="relative z-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg transition-transform hover:scale-105">
            <Mail size={32} className="animate-pulse" />
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent lg:text-5xl">
            Verify Your Account
          </h1>
          <p className="mb-8 text-gray-600">We've sent a verification code to your email</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium text-gray-700">Verification Code</FormLabel>
                  <div className="relative">
                    <Input 
                      {...field} 
                      className="py-6 text-center text-xl tracking-widest rounded-lg border-gray-300 bg-gray-50 transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-200" 
                      placeholder="Enter your code"
                      maxLength={6}
                    />
                  </div>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            <div className="pt-2">
              <Button 
                type="submit" 
                className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 py-3 text-sm font-medium text-white transition-all hover:from-teal-700 hover:to-blue-700 focus:ring-4 focus:ring-teal-300" 
                disabled={isSubmitting}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Account
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  )}
                </span>
              </Button>
            </div>
          </form>
        </Form>
        
        <div className="mt-8 text-center">
          <p className="mb-4 text-sm text-gray-600">Didn&apos;t receive the code?</p>
          <Button 
            onClick={handleResend}
            variant="outline"
            className="w-full border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800 transition-all"
            disabled={isResending}
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend Code
              </>
            )}
          </Button>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Want to try a different account? <Link href="/sign-in" className="font-medium text-teal-600 hover:text-teal-800">Return to sign in</Link>
          </p>
        </div>
        
        {/* Verification timer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            This code will expire in <span className="font-medium text-teal-600">10:00</span> minutes
          </p>
        </div>
      </div>
    </div>
  );
}