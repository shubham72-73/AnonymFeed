import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { NextApiRequest, NextApiResponse } from "next";

export async function DELETE(request: NextApiRequest, response: NextApiResponse){
    const { messageid } = request.query; // Using query for dynamic segments
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user){
        return response.json(
            {
                success: false,
                message: 'Not Authenticated'
            }, 
        );
    }

    try {
        const updateResult = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageid}}}
        );

        if(updateResult.modifiedCount == 0){
            return response.json(
                {
                    success: false,
                    message: 'Message not found or already deleted'
                }, 
            );
        }

        return response.json(
            {
                success: true,
                message: 'Message deleted'
            },

        );
    } catch (error) {
        console.log('Error in deleting message route', error);
        return response.json(
            {
                success: false,
                message: 'Error deleting message'
            },
        );
    }
}
