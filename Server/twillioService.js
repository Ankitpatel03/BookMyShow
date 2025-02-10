const twilio  = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendOtp=(phoneNumber,otp)=>{
    return client.messages.create({
        body:`Your OTP is ${otp}`,
        from:'+12244343594',
        to:phoneNumber
    })
}

module.exports=sendOtp;