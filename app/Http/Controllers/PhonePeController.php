<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Ixudra\Curl\Facades\Curl;
use App\Http\Controllers\Controller;

class PhonePeController extends Controller
{
    public function phonePe()
    {
        $retryCount = 0;
        $maxRetries = 3;
        $retryDelay = 2; // seconds

        do {
            $response = $this->makePhonePeRequest();
            $rData = json_decode($response);

            if (isset($rData->success) && $rData->success === false && $rData->code === 'TOO_MANY_REQUESTS') {
                // Wait before retrying
                sleep($retryDelay);
                $retryCount++;
                $retryDelay *= 2; // Exponential backoff
            } else {
                break;
            }
        } while ($retryCount < $maxRetries);

        if (isset($rData->data->instrumentResponse->redirectInfo->url)) {
            return redirect()->to($rData->data->instrumentResponse->redirectInfo->url);
        } else {
            return response()->json([
                'error' => 'Unexpected response structure',
                'response' => $rData
            ]);
        }
    }

    private function makePhonePeRequest()
    {
        $data = array(
            'merchantId' => 'PGTESTPAYUAT',
            'merchantTransactionId' => uniqid(),
            "merchantUserId" => 'PGTEST' . time(),
            'amount' => 10000,
            'redirectUrl' => route('phonepe.callback'),
            'redirectMode' => 'POST',
            'callbackUrl' => route('phonepe.callback'),
            'mobileNumber' => '9872456794',
            'paymentInstrument' => array(
                'type' => 'PAY_PAGE',
            ),
        );

        $encode = base64_encode(json_encode($data));

        $saltKey = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
        $saltIndex = 1;

        $string = $encode . '/pg/v1/pay' . $saltKey;
        $sha256 = hash('sha256', $string);

        $finalXHeader = $sha256 . '###' . $saltIndex;
        $url = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';

        $headers = array(
            "Content-Type: application/json",
            "accept: application/json",
            "X-VERIFY: " . $finalXHeader,
        );

        $curl = curl_init($url);

        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

        $response = curl_exec($curl);
        curl_close($curl);

        return $response;
    }


    public function response(Request $request)
    {
        $input = $request->all();

        $saltKey = config('services.phonepe.key');
        $saltIndex = 1;

        $finalXHeader = hash('sha256', '/pg/v1/status/' . $input['merchantId'] . '/' . $input['transactionId'] . $saltKey) . '###' . $saltIndex;

        $response = Curl::to('https://api-preprod.phonepe.com/apis/hermes/pg/v1/status/' . $input['merchantId'] . '/' . $input['transactionId'])
            ->withHeader('Content-Type:application/json')
            ->withHeader('accept:application/json')
            ->withHeader('X-VERIFY:' . $finalXHeader)
            ->withHeader('X-MERCHANT-ID:' . $input['transactionId'])
            ->get();

        dd(json_decode($response));
    }


    public function refundProcess($tra_id)
    {
        $payload = [
            'merchantId' => 'MERCHANTUAT',
            'merchantUserId' => 'MUID123',
            'merchantTransactionId' => ($tra_id),
            'originalTransactionId' => strrev($tra_id),
            'amount' => 5000,
            'callbackUrl' => route('response'),
        ];

        $encode = base64_encode(json_encode($payload));

        $saltKey = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
        $saltIndex = 1;

        $string = $encode . '/pg/v1/refund' . $saltKey;
        $sha256 = hash('sha256', $string);

        $finalXHeader = $sha256 . '###' . $saltIndex;

        $response = Curl::to('https://api-preprod.phonepe.com/apis/merchant-simulator/pg/v1/refund')
            ->withHeader('Content-Type:application/json')
            ->withHeader('X-VERIFY:' . $finalXHeader)
            ->withData(json_encode(['request' => $encode]))
            ->post();

        $rData = json_decode($response);



        $finalXHeader1 = hash('sha256', '/pg/v1/status/' . 'MERCHANTUAT' . '/' . $tra_id . $saltKey) . '###' . $saltIndex;

        $responsestatus = Curl::to('https://api-preprod.phonepe.com/apis/merchant-simulator/pg/v1/status/' . 'MERCHANTUAT' . '/' . $tra_id)
            ->withHeader('Content-Type:application/json')
            ->withHeader('accept:application/json')
            ->withHeader('X-VERIFY:' . $finalXHeader1)
            ->withHeader('X-MERCHANT-ID:' . $tra_id)
            ->get();

        dd(json_decode($response), json_decode($responsestatus));
    }
}
