import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request){
    await dbConnect()
    //session lelie
    const session =await getServerSession(authOptions)
    //session se user 
    const user:User = session?.user as User


    if(!session || !session.user){
        return Response.json({
            success: false,
            message: 'Not authenticated',
        },
        {
            status: 401
        }
    )
    }

    const userId =  user._id;
   const {acceptMessages}  =  await request.json();

   try {
    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {isAcceptingMessages:acceptMessages},
        {new:true}
    );

    //if user not found
    if(!updatedUser){
        return Response.json({
            success: false,
            message: 'User hi nhi mil rha to update message acceptance status',
        },
        {status:404}
    )
    }
    return Response.json(
        {
          success: true,
          message: 'Message acceptance status updated successfully',
          updatedUser,
        },
        { status: 200 }
      );
   } catch (error) {
    console.error('Error updating message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error updating message acceptance status' },
      { status: 500 }
    );
   }

}
export async function GET(request :Request){
    await dbConnect()
    
    //session lelie
    const session = await getServerSession(authOptions)
    //session se user 
    const user:User = session?.user as User;
    
    if(!session ||!user){
        return Response.json(
            {
                success: false,
                message: 'Not authenticated',
            },
            {
                status: 401
            }
        )
    }
    try {
        //database se user nikal using userId
        const foundUser = await UserModel.findById(user.id);

        if(!foundUser){
            return Response.json(
                {
                    success: false,
                    message: 'User not found',
                },
                {status: 404}
            )
        }
        //agar user mila toh status batade whether they are accepting messages or not
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error retrieving message acceptance status:', error);
        return Response.json(
          { success: false, message: 'Error retrieving message acceptance status' },
          { status: 500 }
        );
    }
}