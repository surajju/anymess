'use server';
import {z} from 'zod';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import { signUpSchema,usernameValidation } from '@/schemas/signUpSchema';
import { signInSchema } from '@/schemas/signInSchema';
import { CredentialsSignin,User } from 'next-auth';
import { signIn,signOut,auth,InvalidTypeError } from '@/app/auth';
import { checkUsername,createUser,findUserByUsernameOrEmail,updateUser } from '@/db/user';
import { revalidatePath } from 'next/cache';
import { findToken, updateToken } from '@/db/token';
import { error } from 'console';
import { date } from 'drizzle-orm/pg-core';

export async function SignIn(provider:'github' |'google' = 'github'){
    await signIn(provider,{redirectTo : '/dashboard'});
}

export async function SignOut() {
    await signOut();
  }

export async function login(data:z.infer<typeof signInSchema>){
    const validateFields = signInSchema.safeParse(data);
    if(!validateFields.success){
        return{
            type: 'error',
            errors : validateFields.error.flatten().fieldErrors,
            message : 'invalid fields',
        }
    }
    const {identifier,password} = validateFields.data;
    try {
        await signIn('credentials',{
            redirect:false,
            identifier,
            password,
        });

    } catch (error:unknown) {
        if(error instanceof CredentialsSignin){
            switch (error.type){
                case 'CredentialsSignin':
                    return {
                        type: 'error',
                        message : 'Invalid credentials',
                    }
                default:
                    return {
                        type :'error',
                        message:'something went wrong',
                    };
            }
        }else if(error instanceof InvalidTypeError){
            return {
                type : 'error',
                message:
                'seems like you signed up with a social account,please login with that account',
            };
        }else{
            return {
                type: 'error',
                message: 'Something went wrong',
              };
        }
    }
}
export async function saveUser(data:z.infer<typeof signUpSchema>){
    const {username,email,name,password} = data;
    //if exist user then dont save again
    const user = await findUserByUsernameOrEmail(username,email);
    if(user){
        return{
            type: 'error',
            message: 'Username or email already exists',
        }
    }
    //if not exist ,save it
    await createUser(username,email,name,password);

}

const UsernameQuerySchema = z.object({
    username: usernameValidation,
  });

  export async function checkUniqueEmail(username:string){
    const validateFields = UsernameQuerySchema.safeParse({
        username:username,
    });

    if(!validateFields.success){
        return{
            type: 'error',
            errors : validateFields.error.flatten().fieldErrors,
            message: 'Invalid username',
        }
    }
    try{
        const username = await checkUsername(validateFields.data.username);
        if(username){
            return{
                type: 'error',
                message: 'Username already exists',
            }
        }
        return{
            type:'success',
            message: 'Username is available',
        }
    }catch(error){
        console.error('Error checking username :',error);
        return{
            type: 'error',
            message: 'Something went wrong while checking the username',
        }
    }
  }

  export async function verifyCode(username:string,code:string){
    const token = await findToken(username,code);
    if(!token){
        return{
            type: 'error',
            message: 'User not found',
        }
    }

    //check the code
    if(token.token != code){
        return{
            type: 'error',
            message: 'Invalid code',
        }
    }
    //checking for expiry date
    if(new Date(token.expires) < new Date()){
        return {
            type: 'error',
            message: 'Code has expired',
        }
    } 
    //update the user 
    const user = await updateUser(username,{isVerified:true});
    if(!user){
        return{
            type: 'error',
            message: 'Something went wrong',
        }
    }
        return{
            type:'success',
            message: 'User verified successfully',
        };
  }


  export async function resendCode(email :string){
    //get the username
    const user = await findUserByUsernameOrEmail(email,email);

    if(!user){
        return{
            type: 'error',
            message: 'If the email is registered, you will receive a verification code.',
        }
    }
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);
    //update the user with new token

    const verificationToken = await updateToken(user.username!,token,expires);

    if(!verificationToken){
        return {
            type: 'error',
            message: 'if the email is registered, you will receive a verification code.',
        }
    }

    const emailResponse = await sendVerificationEmail(user.email!,user.username!,token);

    if(!emailResponse.success){
    return{
        type: 'error',
        message: 'Please try again later.',
    };
    }
    return{
    type: 'success',
    message: 'Code resent',
    username: user.username,
    }

  }

  export async function changeAcceptMessages(isAcceptingMessages:boolean){
    const session = await auth();
    const _user = session?.user as User;

    if(!session || !_user){
        return{
            type: 'error',
            message: 'Not authenticated',
        }
    }

    const username = _user.username;
    if(!username){
        return{
            type: 'error',
            message: 'Not authenticated',
        }
    }


    const user = await updateUser(username, { isAcceptingMessages });

  if (!user) {
    return {
      type: 'error',
      message: 'Failed to update user',
    };
  } else {
    revalidatePath('/dashboard');
    return {
      type: 'success',
      message: 'Setting updated successfully',
    };
  }
  }
