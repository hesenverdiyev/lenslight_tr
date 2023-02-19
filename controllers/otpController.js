import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import randomstring from "randomstring";
import OTP from '../models/otpModel.js';


var otp = randomstring.generate({
    length: 6,
    charset: 'numeric'
  });
  
  
  const otpCodeSend = async (req, res) => {
    const htmlTemplate = `<p>Works</p>`;
  
    try {
      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport(smtpTransport({
        host:'mail.anketler.info',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_SEND_SESSION,
            pass: process.env.EMAIL_SEND_PASSWORD,
      },
    }));
  
      // send mail with defined transport object
      await transporter.sendMail({
        to: `${req.body.email}`, // list of receivers
        subject: `Confirmation code for Lenslight Registration`, // Subject line
        html: htmlTemplate, // html body
      });
  
      const email = req.body.email;
      const createdAt = Date.now();
  
      const otpDoc = new OTP({
        email: email,
        otp: otp,
        createdAt: createdAt
      });
      
      await otpDoc.save();
      res.status(200).json({ succeeded: true });
    } catch (error) {
      res.status(500).json({
        succeeded: false,
        error,
      });
    }
  };
  
  const otpVerify = async (req, res) => {
  
 
    const collection = mongoose.connection.collection('otps');

    // Get the email and OTP from the request query parameters
    let email = req.body.email;
    let otp = req.body.otp;

    // Query the collection for the provided email and OTP code
   await collection.find({ email: email, otp: otp }).toArray()
      .then((docs) => {
        if (docs.length > 0) {
          // Email and OTP exist in the collection
          res.send({ exists: true });
        } else {
          // Email and OTP do not exist in the collection
          res.send({ exists: false });
        }
      })
      .catch((err) => {
        console.log('Error querying the collection:', err);
        res.send({ exists: false });
      });
 
  };

  export {
    otpCodeSend,
    otpVerify,
  };
    