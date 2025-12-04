import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface StatusUpdateEmailRequest {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  status: string;
  statusMessage: string;
}

const getStatusSubject = (status: string, orderNumber: string): string => {
  const statusMap: Record<string, string> = {
    confirmed: `Order Confirmed - ${orderNumber}`,
    preparing: `Your Order is Being Prepared - ${orderNumber}`,
    ready: `Your Order is Ready - ${orderNumber}`,
    out_for_delivery: `Your Order is Out for Delivery - ${orderNumber}`,
    delivered: `Order Delivered - ${orderNumber}`,
    cancelled: `Order Cancelled - ${orderNumber}`,
  };
  return statusMap[status] || `Order Update - ${orderNumber}`;
};

const getStatusHTML = (emailData: StatusUpdateEmailRequest): string => {
  const statusColors: Record<string, string> = {
    confirmed: '#3b82f6',
    preparing: '#a855f7',
    ready: '#f59e0b',
    out_for_delivery: '#f97316',
    delivered: '#10b981',
    cancelled: '#ef4444',
  };

  const statusIcons: Record<string, string> = {
    confirmed: '✓',
    preparing: '👨‍🍳',
    ready: '⏰',
    out_for_delivery: '🚚',
    delivered: '✅',
    cancelled: '❌',
  };

  const color = statusColors[emailData.status] || '#dc2626';
  const icon = statusIcons[emailData.status] || '📦';

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
    .status-box { background: ${color}15; border-left: 4px solid ${color}; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .status-icon { font-size: 48px; text-align: center; margin: 20px 0; }
    .status-message { font-size: 18px; color: ${color}; font-weight: bold; text-align: center; margin: 10px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    .button { display: inline-block; padding: 12px 24px; background: ${color}; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔥 Spicy Biryani</h1>
      <p>Order Status Update</p>
    </div>
    <div class="content">
      <h2>Dear ${emailData.customerName},</h2>
      <p>We have an update on your order!</p>
      
      <div class="status-box">
        <div class="status-icon">${icon}</div>
        <p class="status-message">${emailData.statusMessage}</p>
        <p style="text-align: center; margin-top: 10px;"><strong>Order Number:</strong> ${emailData.orderNumber}</p>
      </div>
      
      <p>${emailData.statusMessage}. You can track your order in real-time on our website.</p>
      
      <p>Thank you for choosing Spicy Biryani!</p>
      <p>Best regards,<br>Spicy Biryani Team</p>
    </div>
    <div class="footer">
      <p>Need help? Contact us at +91 9390492316</p>
    </div>
  </div>
</body>
</html>
  `;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const emailData: StatusUpdateEmailRequest = await req.json();
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email service not configured',
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

    const htmlContent = getStatusHTML(emailData);
    const subject = getStatusSubject(emailData.status, emailData.orderNumber);

    const emailPayload = {
      from: 'Spicy Biryani <orders@spicybiryanihousegrb.shop>',
      to: [emailData.customerEmail],
      subject: subject,
      html: htmlContent,
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', result);
      return new Response(
        JSON.stringify({
          success: false,
          error: result.message || 'Failed to send email',
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

    console.log('Status update email sent successfully:', result);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        orderNumber: emailData.orderNumber,
        emailId: result.id,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing status update email:', error);
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


