const twilio  = require("twilio");

const accountSid=process.env.id;
const authToken=process.env.token;

const client=new twilio(accountSid,authToken);

const sendOtp=(phoneNumber,otp)=>{
    return client.messages.create({
        body:`Your OTP is ${otp}`,
        from:'+12244343594',
        to:phoneNumber
    })
}

module.exports=sendOtp;