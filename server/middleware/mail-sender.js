import nodemailer from 'nodemailer';
import {
  CronJob,
} from 'cron';

import inLineCss from 'nodemailer-juice';
import dotenv from 'dotenv';
import client from '../models/database/dbconnect';

dotenv.config();

const fetchUsers = async () => {
  try {
    const query = await client.query(
      `SELECT
        user_id,
        first_name,
        email  FROM users WHERE reminder=($1);`, [
        true,
      ],
    );
    const users = query.rows;
    let emailList = [];
    if (users.length === 0) {
      return console.log("No email to send mail to.");
    }
    users.forEach((user) => {
      const {
        email,
        first_name, // eslint-disable-line camelcase
      } = user;
      emailList = [...emailList, email];


      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_CLIENT_USER,
          pass: process.env.GMAIL_CLIENT_PASS,
        },
      });
      transporter.use('compile', inLineCss());

      let url = 'https://res.cloudinary.com/daymoly7f/image/upload/';
      url += 'v1534766326/mydiary-app/mydiary_logo.png';
      const bodyMail = `<style type="text/css">
      .container-fluid {
        width: 100%;
      }
      .container {
        text-align: center;
        width: 600px;
        margin: 0 auto;
        border: 20px solid #f7f7f7;
        padding: 20px;
        padding-bottom: 0;
      }
      .logo {
        width: 150px;
        margin: 10px 0 20px;
      }
      .content {
        min-height: 100px;
        margin-bottom: 20px;
      }
      p {
        font-size: 16px;
        padding: 0 15px;
      }
      .footer {
        border-top: 1px solid #f7f7f7;
        padding: 10px;
        background-color: #FF6839;
        color: #ffffff;
        margin-bottom: 20px;
      }
      </style>
      <div class="container-fluid">
        <div class="container">
          <img class="logo" src="${url}" alt="myDiary logo">
          <h1>Hi, ${first_name// eslint-disable-line camelcase
}</h1>
          <div class="content">
            <p>Thanks for joining and staying with us.Here we choose to give 
            you the best service of keeping your diary accessible from anywhere 
            and secured.</p>
            <p>Please do know that your experience is of great value to you 
            and do remember to checkout your diary entries as often as 
            possible.</p><p>Have you fill in for TODAY?</p>
          </div>
          <div class="footer">
          myDiary @2018
          </div>
        </div>
      </div>`;

      const mailOptions = {
        from: `"myDiary™ 👻" <${process.env.GMAIL_CLIENT_USER}>`,
        to: email,
        subject: `Weekly Reminder 📣📢🔔🔊`,
        html: bodyMail,
      };
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.log(error);
          throw error;
        } else {
          console.log("Email successfully sent!");
        }
      });
    });
    console.log(emailList);
  } catch (err) {
    console.log(err.toString());
  }
};

// sending emails at periodic intervals
const cronMail = new CronJob("00 00 06 * * 1-7", () => {
  console.log("---------------------");
  console.log("Running Cron Job");
  fetchUsers();
});

export default cronMail;