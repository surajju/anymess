import { Message } from "@/model/User";
//api response ka general structure jaha success aur message is mandatory
export interface ApiResponse{
    success:boolean;
    message:string;
    isAcceptingMessages? :boolean;
    messages?:Array<Message>;
}