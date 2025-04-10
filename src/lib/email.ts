import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Shared email template
const emailTemplate = (content: string) => `
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} EHR Clothing. All rights reserved.</p>
  </div>
`

// Update the order status email function
export async function sendOrderStatusUpdateEmail(
  email: string,
  details: {
    orderId: string
    reference: string // Add reference to the details
    status: string
    customerName: string
  }
) {
  const statusMessages = {
    processing: 'is now being processed',
    shipped: 'has been shipped',
    delivered: 'has been delivered',
    cancelled: 'has been cancelled'
  }

  const statusColors = {
    processing: '#3498db',
    shipped: '#9b59b6',
    delivered: '#2ecc71',
    cancelled: '#e74c3c'
  }

  const message = statusMessages[details.status as keyof typeof statusMessages]
  const statusColor = statusColors[details.status as keyof typeof statusColors]

  const content = `
    <h2>Order Status Update</h2>
    <p>Dear ${details.customerName},</p>
    <p>Your order <strong>#${details.reference}</strong> ${message}.</p>
    
    <div style="background: ${statusColor}; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <h3 style="margin: 0;">Current Status: ${details.status.toUpperCase()}</h3>
    </div>
    
    <p>You can track your order status on our website using your order reference: <strong>${details.reference}</strong></p>
    
    <p>If you have any questions, please don't hesitate to contact us.</p>
    
    <p>Best regards,<br>EHR Clothing Team</p>
  `

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: `E.H.R - Order Status Update - ${details.reference}`,
    html: emailTemplate(content),
  })
}

// Add these interfaces at the top of the file after the imports
interface OrderItem {
  id: string
  quantity: number
  price: number
  size: string
  name: string
  color: string
  title: string
  product?: {
    name: string
    price: number
  }
}

export async function sendAdminOrderNotification(
  orderDetails: {
    reference: string
    customerName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    items: OrderItem[] // Replace any[] with OrderItem[]
    total: number
    subtotal: number
    shipping: number
    discount?: number
    coupon?: { code: string; discount: number } | null
  }
) {
  const emailContent = `
    <h1>New Order Alert</h1>
    <p>Hey Riley,</p>
    <p>A customer has initiated an order. No payment has been made yet.</p>
    
    <h2>Order Details</h2>
    <p>Reference: ${orderDetails.reference}</p>
    
    <h3>Customer Information:</h3>
    <p>Name: ${orderDetails.customerName}</p>
    <p>Email: ${orderDetails.email}</p>
    <p>Phone: ${orderDetails.phone}</p>
    <p>Address: ${orderDetails.address}</p>
    <p>City: ${orderDetails.city}</p>
    <p>State: ${orderDetails.state}</p>
    
    <h3>Items:</h3>
    <ul>
      ${orderDetails.items
      .map(
        (item) => `
        <li>
          ${item.quantity}x ${item.title} (Size: ${item.size}, Color: ${item.color})
          - ₦${(item.price * item.quantity).toLocaleString()}
        </li>
      `
      )
      .join('')}
    </ul>
    
    <p>Subtotal: ₦${orderDetails.subtotal.toLocaleString()}</p>
    <p>Shipping: ₦${orderDetails.shipping.toLocaleString()}</p>
    ${orderDetails.discount && orderDetails.discount > 0 ?
      `<p>Discount: -₦${orderDetails.discount.toLocaleString()}${orderDetails.coupon ? ` (Coupon: ${orderDetails.coupon.code})` : ''
      }</p>` : ''}
    <p>Total: ₦${orderDetails.total.toLocaleString()}</p>
  `

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'investorhonour@gmail.com',
    subject: `E.H.R - New Order Alert - ${orderDetails.reference}`,
    html: emailContent,
  })
}

export async function sendOrderConfirmationEmail(
  email: string,
  orderDetails: {
    reference: string
    customerName: string
    items: OrderItem[] // Replace any[] with OrderItem[]
    total: number
    subtotal: number
    shipping: number
    discount?: number
    coupon?: { code: string; discount: number } | null
  }
) {
  const content = `
    <h1>Order Confirmation</h1>
    <p>Dear ${orderDetails.customerName},</p>
    <p>Thank you for shopping with us! We have received your order and it is being processed.</p>
    <p>Order Reference: ${orderDetails.reference}</p>
   
    <p>We will notify you once your order has been shipped.</p>

    <p>Best regards,<br>EHR Clothing Team</p>

    <hr>
    <p>This message was sent because you placed an order at EHR Clothing.<br>
    Contact us: ${process.env.NEXT_PUBLIC_ADMIN_PHONE}<br>
   `

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: `E.H.R - Order Confirmation - ${orderDetails.reference}`,
    html: emailTemplate(content),
  })
}




export async function sendPaymentConfirmationEmail(to: string, data: {
  reference: string;
  customerName: string;
  amount: number;
  phone: string;
  items: OrderItem[];
}) {
  const { reference, customerName, amount, items, phone } = data;

  const content = `
    <h2>Order Processing Update</h2>
    <p>Dear ${customerName},</p>
    <p>Thank you for completing your order (${reference}). We are now processing your request.</p>
    <h3>Order Details:</h3>
    <ul>
      ${items.map(item => `<li>${item.name} x ${item.quantity} - ₦${item.price.toLocaleString()}</li>`).join('')}
    </ul>
    <p>Order Total: ₦${amount.toLocaleString()}</p>
    <p>We'll notify you once your items have been shipped.</p>
    <p>Best regards,<br>EHR Clothing Team</p>
  `;

  // WhatsApp message content
  const whatsappContent = `Dear ${customerName},\n\nThank you for completing your order (${reference}). We are now processing your request.\n\nOrder Details:\n${items.map(item => `${item.name} x ${item.quantity} - ₦${item.price.toLocaleString()}`).join('\n')}\n\nOrder Total: ₦${amount.toLocaleString()}\n\nWe'll notify you once your items have been shipped.\n\nBest regards,\nEHR Clothing Team`;

  // Send WhatsApp message
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("token", "0vkwos7s07t0ljee");
  urlencoded.append("to", phone);
  urlencoded.append("body", whatsappContent);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow' as RequestRedirect
  };

  try {
    // Send both email and WhatsApp message in parallel
    await Promise.all([
      transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: `E.H.R - Order Processing Started - ${reference}`,
        html: emailTemplate(content),
      }),
      fetch("https://api.ultramsg.com/instance112936/messages/chat", requestOptions)
    ]);
  } catch (error) {
    console.error('Error sending notifications:', error);
    throw error;
  }
}

export async function sendAdminPaymentNotification(data: {
  to: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  items: OrderItem[];
}) {
  const { to, reference, customerName, customerEmail, amount, items } = data;
  const trackingUrl = `https://ehrclothing.store/tracking?code=${reference}`;

  const content = `
    <h2>New Payment Received</h2>
    <p>New payment received for order ${reference}</p>
    <h3>Customer Details:</h3>
    <p>Name: ${customerName}<br>Email: ${customerEmail}</p>
    <h3>Order Details:</h3>
    <ul>
      ${items.map(item => `<li>${item.name} x ${item.quantity} - ₦${item.price.toLocaleString()}</li>`).join('')}
    </ul>
    <p>Total Amount: ₦${amount.toLocaleString()}</p>
    <p>Track this order: <a href="${trackingUrl}">${trackingUrl}</a></p>
    <p>Please process this order as soon as possible.</p>
  `;

  // WhatsApp message content for admin
  const whatsappContent = `🔔 New Payment Received!\n\nOrder: ${reference}\nCustomer: ${customerName}\nEmail: ${customerEmail}\nAmount: ₦${amount.toLocaleString()}\n\nTrack order: ${trackingUrl}`;

  console.log(whatsappContent) 
  // Send WhatsApp message
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("token", "0vkwos7s07t0ljee");
  urlencoded.append("to", process.env.NEXT_PUBLIC_ADMIN_PHONE || '');
  urlencoded.append("body", whatsappContent);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow' as RequestRedirect
  };

  try {
     await Promise.all([
      transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: `E.H.R - New Payment Received - Order ${reference}`,
        html: emailTemplate(content),
      }),
      fetch("https://api.ultramsg.com/instance112936/messages/chat", requestOptions)
    ]);
  } catch (error) {
    console.error('Error sending admin notifications:', error);
    throw error;
  }
}

export async function sendContactNotification({
  to,
  name,
  email,
  subject,
  message,
}: {
  to: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const content = `
    <h2>New Contact Form Submission</h2>
    <h3>Sender Details:</h3>
    <p>Name: ${name}<br>Email: ${email}</p>
    <h3>Subject:</h3>
    <p>${subject}</p>
    <h3>Message:</h3>
    <p>${message}</p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `E.H.R - New Contact Form Submission: ${subject}`,
    html: emailTemplate(content),
  });
}

export async function sendContactConfirmation({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const content = `
    <h2>Thank you for contacting us!</h2>
    <p>Dear ${name},</p>
    <p>We have received your message and will get back to you as soon as possible.</p>
    <p>Best regards,<br>E.H.R Clothing Team</p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'We received your message',
    html: emailTemplate(content),
  });
}
