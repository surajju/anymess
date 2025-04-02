import { getMessages } from '@/actions/message';
import { MessageCard } from '@/components/MessageCard';
import { auth } from '@/app/auth';
import { User } from 'next-auth';
import CopyToClipboard from '@/components/CopyToClipboard';
import { redirect } from 'next/navigation';
import UserSetting from '@/components/UserSetting';
import { LinkIcon, InboxIcon, UserIcon } from 'lucide-react';

async function UserDashboard() {
  const session = await auth();
  const _user: User = session?.user as User;
  if (!_user || !_user.id) {
    redirect('/');
  }

  const response = await getMessages();
  const messages = response.type === 'success' ? response.data : [];

  const BASE_URL = process.env.BASE_URL;
  const profileUrl = `${BASE_URL}/u/${_user.username}`;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-teal-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-teal-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-teal-100 p-3 rounded-full">
              <UserIcon className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome, {_user.name || _user.username}</h1>
              <p className="text-gray-500">Manage your profile and messages</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Link Section */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2 border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-4">
              <LinkIcon className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800">Your Profile Link</h2>
            </div>
            <div className="flex items-center bg-gray-50 rounded-md border border-gray-200">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="flex-grow bg-transparent px-4 py-3 text-gray-700 focus:outline-none"
              />
              <div className="px-2">
                <CopyToClipboard profileUrl={profileUrl} />
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500">
            <div className="flex items-center gap-3 mb-4">
              <svg className="h-5 w-5 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
            </div>
            <UserSetting isAcceptingMessages={_user.isAcceptingMessages!} />
          </div>

          {/* Messages Section */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-3 border-t-4 border-teal-500">
            <div className="flex items-center gap-3 mb-6">
              <InboxIcon className="h-5 w-5 text-teal-600" />
              <h2 className="text-xl font-semibold text-gray-800">Your Messages</h2>
            </div>
            
            {(messages?.length || 0) > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {messages?.map((message) => (
                  <MessageCard key={message.id} message={message} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <InboxIcon className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                <p className="text-gray-500">No messages to display yet.</p>
                <p className="text-sm text-gray-400 mt-1">Share your profile link to receive messages</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;