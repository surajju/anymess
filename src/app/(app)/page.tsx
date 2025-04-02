import MessageCarousel from '@/components/CarouselContent';
import { ShieldCheckIcon, MessageSquareIcon, EyeOffIcon } from 'lucide-react';

export default async function Home() {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <main className="flex flex-grow flex-col">
        {/* Header */}
        <div className="mx-auto w-full max-w-7xl px-4 pt-20 pb-16 text-center md:px-10 md:pt-32">
          <div className="animate-fadeIn">
            <h1 className="mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400 bg-clip-text text-4xl font-extrabold text-transparent md:text-6xl lg:text-7xl">
              Dive into the World of<br className="hidden md:block" /> Anonymous Feedback
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-lg text-gray-300 md:text-xl">
              AnyMess is where your thoughts flow freely while your identity remains a secret.
              Share honest feedback without revealing who you are.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-10">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Why Choose AnyMess?</h2>
            <div className="mx-auto h-1 w-20 rounded bg-indigo-500"></div>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="rounded-xl bg-gray-800 p-8 shadow-lg transition-all hover:shadow-indigo-500/20 hover:translate-y-[-4px]">
                <div className="mb-4 inline-flex rounded-full bg-indigo-500/20 p-3">
                  <ShieldCheckIcon className="h-7 w-7 text-indigo-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">Complete Privacy</h3>
                <p className="text-gray-400">Your identity is never revealed. Share your honest thoughts without any worries.</p>
              </div>
              
              <div className="rounded-xl bg-gray-800 p-8 shadow-lg transition-all hover:shadow-indigo-500/20 hover:translate-y-[-4px]">
                <div className="mb-4 inline-flex rounded-full bg-indigo-500/20 p-3">
                  <MessageSquareIcon className="h-7 w-7 text-indigo-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">Honest Dialogue</h3>
                <p className="text-gray-400">Foster genuine conversations and receive unfiltered feedback from others.</p>
              </div>
              
              <div className="rounded-xl bg-gray-800 p-8 shadow-lg transition-all hover:shadow-indigo-500/20 hover:translate-y-[-4px]">
                <div className="mb-4 inline-flex rounded-full bg-indigo-500/20 p-3">
                  <EyeOffIcon className="h-7 w-7 text-indigo-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">Zero Tracking</h3>
                <p className="text-gray-400">We don't store IP addresses or any identifying information. Your privacy comes first.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Carousel Section */}
        <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-10">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">See What Others Are Saying</h2>
            <div className="mx-auto h-1 w-20 rounded bg-indigo-500"></div>
            <p className="mx-auto mt-4 max-w-2xl text-gray-300">
              Real anonymous messages from our community. Genuine thoughts shared without reservation.
            </p>
          </div>
          
          <div className="mx-auto max-w-5xl rounded-2xl bg-gray-800/50 p-4 shadow-xl backdrop-blur-sm md:p-8">
            <MessageCarousel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-center text-gray-400">
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          <p>© {year} AnyMess | Made with Next.js & AuthJS</p>
        </div>
      </footer>
    </div>
  );
}