import { SignIn,SignOut } from "@/actions/auth";
import { Button } from '@/components/ui/button';
import { FaGithub, FaGoogle } from 'react-icons/fa'; 
export function SignOutBtn(props: React.ComponentPropsWithRef<typeof Button>) {
    return (
      <form action={SignOut}>
        <Button variant="destructive" {...props}>
          Sign Out
        </Button>
      </form>
    );
  }

  export function SignInBtn() {
    return (
      <div className="flex flex-col sm:flex-row gap-3 w-full">
      <form action={() => SignIn('github')} className="w-full">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
        >
        <span className="h-5 w-5">
            <FaGithub size="100%" />
          </span>
          <span>GitHub</span>
        </Button>
      </form>
      
      <form action={() => SignIn('google')} className="w-full">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
        >
         <span className="h-5 w-5 text-red-500">
            <FaGoogle size="100%" />
          </span>
          <span>Google</span>
        </Button>
      </form>
    </div>
    );
  }