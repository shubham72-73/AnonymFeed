import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

export async function DELETE(request: Request, context: { params: { messageid: string } }) {
    const { messageid } = context.params;
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return new Response(JSON.stringify({ success: false, message: "Not Authenticated" }), { status: 401 });
    }

    try {
        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageid } } }
        );

        if (updateResult.modifiedCount === 0) {
            return new Response(JSON.stringify({ success: false, message: "Message not found or already deleted" }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, message: "Message deleted" }), { status: 200 });
    } catch (error) {
        console.error("Error in deleting message route", error);
        return new Response(JSON.stringify({ success: false, message: "Error deleting message" }), { status: 500 });
    }
}
