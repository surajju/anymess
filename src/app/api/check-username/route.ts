import dbConnect from "@/lib/dbConnect";
import UserModel from '@/model/User';
import {z} from 'zod';
import { usernameValidation } from "@/schemas/signUpSchema";


//schema banao for checking the validity
const UsernameQuerySchema = z.object({
    username :  usernameValidation
});

export async function GET(request:Request){
    await dbConnect();
    try {
        //url se usernme nikalne ki kosis
        const {searchParams} = new URL(request.url);
        const queryParams = {
            username : searchParams.get('username'),
        };
        //matching query params
        const result  = UsernameQuerySchema.safeParse(queryParams);
        if(!result.success){
            const usernameErrors =result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(', ')
              : 'Invalid query parameters',
        },
        { status: 400 }      
            );
        }

        const {username} = result.data;
        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true,
        });

        //agar username se already verified user exist karta hai toh
        if (existingVerifiedUser) {
            return Response.json(
              {
                success: false,
                message: 'Username is already taken',
              },
              { status: 200 }
            );
          }

          //agar exist nhi krta toh unique hai wo username
          return Response.json(
            {
              success: true,
              message: 'Username is unique',
            },
            { status: 200 }
          );
          
    } catch (error) {
        console.error('Error checking username :',error);
        return Response.json(
            {
                success: false,
                message: 'Failed to check username'
            },
            { status : 500}
        )
    }
}
