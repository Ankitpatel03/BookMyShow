// const express = require('express');
// const sendOtp = require('./twillioService'); 
// const app = express();
// app.use(express.json());

// app.post('/send-otp', async (req, res) => {
//   const { phoneNumber } = req.body;


//   const otp = Math.floor(100000 + Math.random() * 900000);

//   try {
//     await sendOtp(phoneNumber, otp);
//     res.status(200).send({ message: 'OTP sent successfully', otp });
//   } catch (error) {
//     res.status(500).send({ error: 'Failed to send OTP' });
//   }
// });

// app.listen(1000, () => {
//   console.log('Server is running on port 1000');
// });


const express = require('express');
const mongoose = require('mongoose');
const sendOtp = require('./twillioService'); // Twilio service to send OTP
const Otp = require('./model/otp'); // OTP model
let cors=require('cors')
const app = express();
app.use(cors())
app.use(express.json());
const Movie = require('./model/movies');
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/otp', {
  
});

// const dburl=process.env.ATLASDB_URL

app.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  console.log(phoneNumber,"hewheh");
  

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Set expiration time for the OTP (1 minute from now)
  const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 minute

  try {
    // Send OTP via Twilio
    await sendOtp(phoneNumber, otp);

    // Save OTP and phone number in the database
    const newOtp = new Otp({
      phoneNumber,
      otp,
      expiresAt:expiresAt.toString(),
    });
    await newOtp.save();

    res.status(200).send({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to send OTP' });
  }
});

// Assuming your OTP model is in models/Otp

const jwt = require('jsonwebtoken');


app.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    // Find the OTP record
    const otpRecord = await Otp.findOne({ phoneNumber, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP or phone number' });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // OTP is valid, generate JWT
    const token = jwt.sign(
      { phoneNumber }, // Include user info and role in the payload
      'HEHEHEHEHEHEHEHEHE',
      { expiresIn: '1h' } // Token valid for 1 hour
    );

    // Delete the OTP after verification
    await Otp.deleteOne({ phoneNumber });

    // Send the token to the client
    res.status(200).json({ token, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error' });
  }
});







// Route to add dummy movie data
app.post('/add-movies', async (req, res) => {
  try {
    const movies = req.body; // Expecting movie data in the request body
    await Movie.insertMany(movieData);
    res.status(200).send('Movies added successfully');
  } catch (error) {
    res.status(500).send('Error adding movies: ' + error.message);
  }
});

// Route to get all movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).send('Error fetching movies: ' + error.message);
  }
});



const authorizeRole = (role) => (req, res, next) => {
  let token=      req.headers.authorization
  if(!token){
    return res.send('unauthorizedddddd')
  }
  next()

}





// routes/paymentRoutes.js
const stripe = require('stripe')('sk_test_51QSzrtBcznYM8OBw3zB2qvIHsbKwdFLlG89CzzwbgZtSvJdArq3KKlqvRhLhUrK1AsuMYFhe8ReG9PL4uLRLVqip00wFefed6q');

app.post('/payment',authorizeRole(), async (req, res) => {
  const { seats, totalAmount } = req.body;

  try {
    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',  
            product_data: {
              name: `Booking for ${seats.length}  `,
    
            },
            unit_amount: totalAmount * 100, // Stripe expects amount in the smallest currency unit (e.g., paise)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/success`,
      cancel_url: `http://localhost:5173/cancel`,
    });

    // Send the session ID to the frontend
    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: 'Unable to create payment session' });
  }
});






app.listen(8000, () => {
  console.log('Server is running on port 8000');
});