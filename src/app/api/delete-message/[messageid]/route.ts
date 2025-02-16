import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { NextRequest, NextResponse } from "next/server"; // Import NextRequest and NextResponse

export async function DELETE(request: NextRequest, { params }: { params: { messageid: string } }) { // Use NextRequest
    const messageId = params.messageid;
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return NextResponse.json( // Use NextResponse
            {
                success: false,
                message: 'Not Authenticated'
            }, { status: 401 }
        );
    }
    try {
        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );
        if (updateResult.modifiedCount == 0) {
            return NextResponse.json( // Use NextResponse
                {
                    success: false,
                    message: 'Message not found or already deleted'
                }, { status: 404 }
            );
        }
        return NextResponse.json( // Use NextResponse
            {
                success: true,
                message: 'Message deleted'
            },
            { status: 200 }
        );
    } catch (error) {
        console.log('Error in deleting message route', error);
        return NextResponse.json( // Use NextResponse
            {
                success: false,
                message: 'Error deleting message'
            }, { status: 500 }
        );
    }
}