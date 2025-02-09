// import {resend} from "@/lib/resend";
// import VerificationEmail from "../../emails/VerificationEmail";
// import { ApiResponse } from "@/types/ApiResponse";
// // import { getMaxListeners } from "events";

// export async function sendVerificationEmail(
//     // email: string,
//     username: string,
//     verifyCode: string
// ): Promise<ApiResponse> {
//     try {
//         await resend.emails.send({
//             from: 'onboarding@resend.com',
//             to: "topshivani390@gmail.com",
//             subject: 'Mystery message | Verification code',
//             react: VerificationEmail({username, otp: verifyCode}),
//         });
//         return {success: true, message: 'Verification email sent successfully'}
//     } catch (emailError) {
//         console.log("Error sending verification email", emailError);
//         return {success: false, message: 'Failed to send verification email'}
//     }
// }


// import VerificationEmail from "../../emails/VerificationEmail";
// import { ApiResponse } from "@/types/ApiResponse";
// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST() {
//     Promise<ApiResponse>{try {
//     const { data, error } = await resend.emails.send({
//       from: 'Acme <onboarding@resend.dev>',
//       to: ['delivered@resend.dev'],
//       subject: 'Hello world',
//       react: VerificationEmail({username, otp: verifyCode}),
//     });

//     if (error) {
//       return Response.json({ error }, { status: 500 });
//     }}

//     return Response.json(data);
//   } catch (error) {
//     return Response.json({ error }, { status: 500 });
//   }
// }
