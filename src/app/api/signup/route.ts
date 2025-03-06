import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";


import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
export async function POST(request: Request){
    await dbConnect();
    try {
       const  {username,email,password} = await request.json() 

       //user who exist and is verified
       const existingUserVerify = await UserModel.findOne(
        {
            username,
            isVerified: true
        })
        if(existingUserVerify ){
            return Response.json({
                succes:false,
                message: "User already exist and is verified",
            },{status: 400})
        }

        const existingUserByEmail = await UserModel.findOne({email});
        let verifyCode = Math.floor(10000 + Math.random()* 900000).toString();
        if(existingUserByEmail){
          if(existingUserByEmail.isVerified){
            return Response.json({
                succes:false,
                message: "User already exist with this email",
            },{status: 400})
          }else{
            const hashedPassword = await bcrypt.hash(password,10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await existingUserByEmail.save();
          }
        }else{
           //phla baar aya hai
           const hashedPassword  = await bcrypt.hash(password,10)
           const expiryDate = new Date()
           expiryDate.setHours( expiryDate.getHours() +1)

            const newUser = new UserModel({
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessages:true,
                    messages: []//array of type of Message
             })
             await newUser.save()
        }
       
        //send verification email

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );
        if (!emailResponse.success) {
            return Response.json(
              {
                success: false,
                message: emailResponse.message,
              },
              { status: 500 }
            );
          }
          return Response.json(
            {
                success:true,
                message :"User registered successfully.Please verify your account."
            },
            { status: 201 }
          );
      
    } catch (error) {
       console.error("Error registering user",error)
        return Response.json({
            success: false,
            message: "Failed to register user",
        },
         {
            status: 500
         }
    );
    }
}