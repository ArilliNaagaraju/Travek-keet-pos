const crypto = require("crypto");
const Razorpay = require("razorpay");

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay = razorpayKeyId && razorpayKeySecret
  ? new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    })
  : null;

const isDev = process.env.NODE_ENV !== 'production';
const useDevMock = !razorpay && isDev;

exports.createOrder = async (req, res) => {
  try {
    if (!razorpay && !useDevMock) {
      return res.status(500).json({
        success: false,
        message: "Razorpay keys are not configured on server.",
      });
    }

    const amount = Number(req.body?.amount || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount." });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    if (useDevMock) {
      // Create a mock order for local development/testing when keys are missing
      const mockOrderId = `order_mock_${Date.now()}`;
      return res.status(201).json({
        success: true,
        data: {
          orderId: mockOrderId,
          amount: options.amount,
          currency: options.currency,
          keyId: razorpayKeyId || 'rzp_test_mock',
        },
      });
    }

    const order = await razorpay.orders.create(options);
    return res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: razorpayKeyId,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};


    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment verification fields." });
    }

    if (!razorpayKeySecret) {
      if (useDevMock && String(razorpay_order_id).startsWith('order_mock_')) {
        // Accept mock verification in development
        return res.status(200).json({ success: true, message: 'Mock payment verified.' });
      }
      return res.status(500).json({ success: false, message: "Razorpay secret is not configured." });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid payment signature." });
    }

    return res.status(200).json({ success: true, message: "Payment verified." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

