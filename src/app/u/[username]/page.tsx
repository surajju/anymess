'use client';

import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send, MessageSquare, Shield, EyeOff, UserCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import * as z from 'zod';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { sendMessage } from '@/actions/message';

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isSent, setIsSent] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const maxChars = 500;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  const messageContent = form.watch('content');

  useEffect(() => {
    // Page load animation
    setIsPageLoaded(true);
    
    // Random sparkle animation timer
    const sparkleInterval = setInterval(() => {
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 1500);
    }, 5000);
    
    return () => clearInterval(sparkleInterval);
  }, []);

  useEffect(() => {
    setCharCount(messageContent?.length || 0);
  }, [messageContent]);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    const response = await sendMessage(username, data.content);

    if (response.type === 'error') {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 3000);
      // Reset the form and set isLoading to false
      form.reset({ ...form.getValues(), content: '' });
    }
    setIsLoading(false);
  };

  const handleCreateAccount = () => {
    // Redirect to the sign-up page
    router.push('/sign-up');
  };

  // Generate a random avatar color
  const avatarColors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
  const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4 text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-1 w-1 rounded-full bg-blue-500 opacity-70 shadow-xl shadow-blue-500 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 h-2 w-2 rounded-full bg-purple-500 opacity-70 shadow-xl shadow-purple-500 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 h-1 w-1 rounded-full bg-pink-500 opacity-70 shadow-xl shadow-pink-500 animate-pulse"></div>
        <div className="absolute bottom-1/2 right-1/3 h-2 w-2 rounded-full bg-indigo-500 opacity-70 shadow-xl shadow-indigo-500 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-2/3 right-1/2 h-1 w-1 rounded-full bg-blue-500 opacity-70 shadow-xl shadow-blue-500 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div 
        className={`container mx-auto my-8 max-w-2xl overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-lg shadow-2xl transition-all duration-1000 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        {/* Header with user info */}
        <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 h-20 w-20 rounded-br-full bg-white/10 animate-[spin_20s_linear_infinite]"></div>
          <div className="absolute bottom-0 right-0 h-16 w-16 rounded-tl-full bg-white/10 animate-[spin_15s_linear_infinite]"></div>
          
          <div className="relative">
            <div className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full ${randomColor} text-white ring-4 ring-white/20 transition-transform duration-700 hover:scale-110`}>
              <UserCircle size={60} className="animate-pulse" />
              {showSparkle && (
                <Sparkles 
                  size={60} 
                  className="absolute text-yellow-300 animate-ping" 
                  style={{animationDuration: '1.5s'}} 
                />
              )}
            </div>
            <h2 className="mb-1 text-xl font-bold text-white animate-fade-in" style={{animationDelay: '300ms'}}>@{username}</h2>
            <p className="text-sm font-medium text-white/70 animate-fade-in" style={{animationDelay: '600ms'}}>Waiting to hear from you anonymously</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="mb-8 rounded-xl bg-gray-700/50 p-4 animate-fade-in" style={{animationDelay: '900ms'}}>
            <div className="flex items-center gap-3 text-white/80">
              <MessageSquare size={18} className="animate-bounce" style={{animationDuration: '2s'}} />
              <h1 className="text-lg font-semibold">Send Anonymous Message</h1>
            </div>
            <p className="mt-2 text-sm text-white/60">
              Your identity will remain completely anonymous. Share your thoughts freely!
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="animate-fade-in" style={{animationDelay: '1200ms'}}>
                    <div className="flex justify-between">
                      <FormLabel className="text-white/80">
                        <span className="flex items-center gap-2">
                          <EyeOff size={14} className="transition-transform hover:scale-125" />
                          Anonymous Message
                        </span>
                      </FormLabel>
                      <span className={`text-xs ${charCount > maxChars ? 'text-red-400' : 'text-white/60'}`}>
                        {charCount}/{maxChars}
                      </span>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="What would you like to say anonymously? Be kind..."
                        className="min-h-32 resize-none rounded-xl border-gray-700 bg-gray-900/50 text-white placeholder:text-gray-500 focus:border-purple-500 transition-all duration-300 focus:shadow-lg focus:shadow-purple-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between animate-fade-in" style={{animationDelay: '1500ms'}}>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-green-400 animate-pulse" />
                  <span className="text-xs text-white/60">100% Anonymous</span>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading || !messageContent || charCount > maxChars}
                  className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 ${isSent ? 'bg-green-500' : ''}`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </span>
                  ) : isSent ? (
                    <span className="flex items-center">
                      Message Sent!
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="mr-2 h-4 w-4" />
                      Send Anonymously
                    </span>
                  )}
                  
                  {/* Button hover effect */}
                  <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-shine"></span>
                </Button>
              </div>
            </form>
          </Form>

          <Separator className="my-8 bg-gray-700" />
          
          <div className="mt-6 space-y-6 text-center animate-fade-in" style={{animationDelay: '1800ms'}}>
            <div className="rounded-xl bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6 transition-transform hover:scale-105 duration-300">
              <h3 className="mb-3 text-lg font-semibold text-white">Want Your Own Anonymous Inbox?</h3>
              <p className="mb-4 text-sm text-white/70">Create your personal anonymous message board and share it with friends</p>
              <Button 
                onClick={handleCreateAccount}
                className="group w-full rounded-xl bg-white px-6 py-2 font-medium text-gray-900 transition-all hover:bg-gray-100 hover:shadow-lg hover:shadow-white/20 relative overflow-hidden"
              >
                <span className="relative z-10">Create Your Account</span>
                
                {/* Button animation effect */}
                <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent -translate-x-full group-hover:animate-shine"></span>
              </Button>
            </div>
            
            <p className="text-xs text-white/40">
              By using this service, you agree to our Terms of Service and Privacy Policy.
              We do not store IP addresses or any identifying information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Add this to your global CSS or component */
