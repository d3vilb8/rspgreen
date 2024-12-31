<?php

namespace App\Http\Controllers;

use Razorpay\Api\Api;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    private $razorpay;

    public function __construct()
    {
        $this->razorpay = new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));
    }

    public function createOrder(Request $request)
    {
        $amount = 5000; // Amount in paise (e.g., 100 = ₹1)

        // Create Razorpay order
        $order = $this->razorpay->order->create([
            'receipt' => 'order_rcptid_11',
            'amount' => $amount,
            'currency' => 'INR',
        ]);

        // Return order data to the view
        return view('payments.checkout', [
            'orderId' => $order['id'],
            'amount' => $amount,
            'key' => env('RAZORPAY_KEY'),
        ]);
    }

    public function paymentSuccess(Request $request)
    {
        // Validate Razorpay signature
        $signature = $request->razorpay_signature;
        $paymentId = $request->razorpay_payment_id;
        $orderId = $request->razorpay_order_id;

        $generatedSignature = hash_hmac('sha256', $orderId . '|' . $paymentId, env('RAZORPAY_SECRET'));

        if ($generatedSignature === $signature) {
            // Payment successful
            return response()->json(['status' => 'success']);
        }

        // Payment failed
        return response()->json(['status' => 'failed'], 400);
    }
}
