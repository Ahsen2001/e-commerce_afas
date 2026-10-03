const catchAsyncError = require("../middlewares/catchAsyncError");
const stripePackage = require('stripe');

const getStripeClient = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable");
  }
  return stripePackage(secretKey);
};

exports.processPayment = catchAsyncError(async (req, res, next) => {
    try {
        console.log("========== STRIPE PAYMENT ==========");
        console.log("BODY:", JSON.stringify(req.body, null, 2));

        const stripe = getStripeClient();

        console.log("Stripe client created");

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Number(req.body.amount),
            currency: "usd",
            description: "TEST PAYMENT",
            metadata: {
                integration_check: "accept_payment",
            },
            shipping: req.body.shipping,
        });

        console.log("PAYMENT SUCCESS:", paymentIntent.id);

        res.status(200).json({
            success: true,
            client_secret: paymentIntent.client_secret,
        });

    } catch (error) {
        console.error("========== STRIPE ERROR ==========");
        console.error("MESSAGE:", error.message);
        console.error("TYPE:", error.type);
        console.error("CODE:", error.code);
        console.error("PARAM:", error.param);
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
            type: error.type,
            code: error.code,
            param: error.param,
        });
    }
});
exports.sendStripeApi  = catchAsyncError(async(req, res, next) => {
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    })
})

