import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface StatusUpdateSMSRequest {
  customerName: string;
  customerPhone: string;
  orderNumber: string;
  status: string;
  statusMessage: string;
}

const getStatusSMSMessage = (smsData: StatusUpdateSMSRequest): string => {
  return `Dear ${smsData.customerName}, ${smsData.statusMessage} Order: ${smsData.orderNumber}. Track your order in real-time on our website. Thank you, Spicy Biryani!`;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const smsData: StatusUpdateSMSRequest = await req.json();
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      console.error('Twilio credentials not configured');
      console.log('SMS would have been sent to:', smsData.customerPhone);
      console.log('Message:', getStatusSMSMessage(smsData));
      
      return new Response(
        JSON.stringify({
          success: false,
          error: 'SMS service not configured',
          logged: true,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const smsMessage = getStatusSMSMessage(smsData);
    const authHeader = btoa(`${twilioAccountSid}:${twilioAuthToken}`);
    
    const formData = new URLSearchParams();
    formData.append('To', smsData.customerPhone);
    formData.append('From', twilioPhoneNumber);
    formData.append('Body', smsMessage);

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Twilio API error:', result);
      return new Response(
        JSON.stringify({
          success: false,
          error: result.message || 'Failed to send SMS',
        }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('Status update SMS sent successfully:', result);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'SMS sent successfully',
        orderNumber: smsData.orderNumber,
        messageSid: result.sid,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing status update SMS:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});


