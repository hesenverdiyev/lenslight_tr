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
    const htmlTemplate = `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Simple Transactional Email</title>
        <style>
          /* -------------------------------------
              GLOBAL RESETS
          ------------------------------------- */
          
          /*All the styling goes here*/
          
          img {
            border: none;
            -ms-interpolation-mode: bicubic;
            max-width: 100%; 
          }
    
          body {
            background-color: #f6f6f6;
            font-family: sans-serif;
            -webkit-font-smoothing: antialiased;
            font-size: 14px;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%; 
          }
    
          table {
            border-collapse: separate;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            width: 100%; }
            table td {
              font-family: sans-serif;
              font-size: 14px;
              vertical-align: top; 
          }
    
          /* -------------------------------------
              BODY & CONTAINER
          ------------------------------------- */
    
          .body {
            background-color: #f6f6f6;
            width: 100%; 
          }
    
          /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
          .container {
            display: block;
            margin: 0 auto !important;
            /* makes it centered */
            max-width: 580px;
            padding: 10px;
            width: 580px; 
          }
    
          /* This should also be a block element, so that it will fill 100% of the .container */
          .content {
            box-sizing: border-box;
            display: block;
            margin: 0 auto;
            max-width: 580px;
            padding: 10px; 
          }
    
          /* -------------------------------------
              HEADER, FOOTER, MAIN
          ------------------------------------- */
          .main {
            background: #ffffff;
            border-radius: 3px;
            width: 100%; 
          }
    
          .wrapper {
            box-sizing: border-box;
            padding: 20px; 
          }
    
          .content-block {
            padding-bottom: 10px;
            padding-top: 10px;
          }
    
    
        </style>
      </head>
      <body>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
          <tr>
            <td>&nbsp;</td>
            <td class="container">
              <div class="content">
    
                <!-- START CENTERED WHITE CONTAINER -->
                <table role="presentation" class="main">
    
                  <!-- START MAIN CONTENT AREA -->
                  <tr>
                    <td class="wrapper">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <p>Your Email: ${req.body.email}</p>
                            <p>Confirmation code: <b>${otp}</b></p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
    
                <!-- END MAIN CONTENT AREA -->
                </table>
                <!-- END CENTERED WHITE CONTAINER -->
    
    
              </div>
            </td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>
    `;
  
    try {
      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport(smtpTransport({
        host:'scp106.hosting.reg.ru',
        secureConnection: true,
        tls: {
          rejectUnauthorized: false
        },
        port: 587,
        auth: {
            user: process.env.NODE_MAIL,
            pass: process.env.NODE_PASS,
      }
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
    