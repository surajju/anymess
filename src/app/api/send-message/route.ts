import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

import { Message } from "@/model/User";

export async function POST(request:Request){
    await dbConnect();
    const {username,content} = await request.json()

    try {
       const user = await  UserModel.findOne({username}).exec();

       if(!user){
        return Response.json({
            success: false,
            message: 'User not found'
        },{
            status: 404
        })
       }

       //check kar user message accept kar rha hai ki nhi
if(!user.isAcceptingMessages){
    return Response.json(
        {
            success: false,
            message: 'User is not accepting messages'
        },
        {
            status: 403
        }
    )
}
const newMessage = {content , createdAt : new Date()};
//new msg ko user message array me dalde
user.messages.push(newMessage as Message);
await user.save();

return Response.json(
    {
            success: true,
            message: 'Message sent successfully'
        },
        {status: 201}
    
)

    } catch (error) {
        console.error('Error adding message :',error);
       return  Response.json(
        {
            success: false,
            message: 'internal server error'
        },
        {status: 500}
       )
    }
}