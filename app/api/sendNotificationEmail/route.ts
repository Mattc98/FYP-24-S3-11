import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { email, roomName, bookingDate, bookingTime, directorName } = await request.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Booking Override Notification',
    text: `Dear user, your booking for room ${roomName} on ${bookingDate} at ${bookingTime} has been overridden by ${directorName}.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Notification email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}
