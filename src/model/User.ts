import mongoose,{Schema, Document} from "mongoose";
//data structure for Message
export interface Message extends Document{
    content: string;
    createdAt: Date;
}
//schema for Message
const MessageSchema : Schema<Message> = new Schema({
    content: {type: String, required: true},
    createdAt: {type: Date,required:true, default: Date.now}
})
//user ka data structure
export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];//array of type of Message
}

const UserSchema : Schema<User> = new Schema({
    username: {type: String, required: [true,"Username is required"],trim: true, unique: true},
    email: {type: String, required: [true,"Email is required"], unique: true,match:[/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/,'please use a valid email address']},
    password: {type: String, required: [true,"Password is required"]},
    verifyCode: {type:String,required: [true,"Verify Code is required"]},
    verifyCodeExpiry: {type : Date,required: [true,"verify Code Expiry is required"]},
    isVerified: {type:Boolean,boolean:false,},
    isAcceptingMessages: {type: Boolean, default: true},
    messages: [MessageSchema]//array of type of Message
})


//exporting model
const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema));

export default UserModel;
