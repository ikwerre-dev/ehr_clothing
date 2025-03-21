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
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: white; padding: 20px; text-align: center; }
        .content { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .footer { text-align: center; margin-top: 20px; padding: 20px; color: #666; }
        .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; }
        .item-list { background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 10px 0; }
        .total-section { border-top: 2px solid #eee; margin-top: 20px; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>EHR Clothing</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} EHR Clothing. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
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
    subject: `Order Status Update - ${details.reference}`,
    html: emailTemplate(content),
  })
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
    items: any[]
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
      `<p>Discount: -₦${orderDetails.discount.toLocaleString()}${
        orderDetails.coupon ? ` (Coupon: ${orderDetails.coupon.code})` : ''
      }</p>` : ''}
    <p>Total: ₦${orderDetails.total.toLocaleString()}</p>
  `

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: 'codewithhonour@gmail.com',
    subject: `New Order Alert - ${orderDetails.reference}`,
    html: emailContent,
  })
}

export async function sendOrderConfirmationEmail(
  email: string,
  orderDetails: {
    reference: string
    customerName: string
    items: any[]
    total: number
    subtotal: number
    shipping: number
    discount?: number
    coupon?: { code: string; discount: number } | null
  }
) {
  const content = `
    <h2>Order Confirmation</h2>
    <p>Dear ${orderDetails.customerName},</p>
    <p>Thank you for your order! Your order has been received and payment has been initiated.</p>
    
    <div style="background: #3498db; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <h3 style="margin: 0;">Order Reference: ${orderDetails.reference}</h3>
    </div>
    
    <div class="item-list">
      <h3>Items:</h3>
      <ul style="list-style: none; padding: 0;">
        ${orderDetails.items
          .map(
            (item) => `
          <li style="padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
            <div>
              <strong>${item.title}</strong><br>
              <span style="color: #666;">Size: ${item.size} • Color: ${item.color} • Qty: ${item.quantity}</span>
            </div>
            <div style="text-align: right;">
              ₦${(item.price * item.quantity).toLocaleString()}
            </div>
          </li>
        `
          )
          .join('')}
      </ul>
    </div>
    
    <div class="total-section">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span>Subtotal:</span>
        <span>₦${orderDetails.subtotal.toLocaleString()}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span>Shipping:</span>
        <span>₦${orderDetails.shipping.toLocaleString()}</span>
      </div>
      ${orderDetails.discount && orderDetails.discount > 0 ? `
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #2ecc71;">
        <span>Discount${orderDetails.coupon ? ` (${orderDetails.coupon.code})` : ''}:</span>
        <span>-₦${orderDetails.discount.toLocaleString()}</span>
      </div>
      ` : ''}
      <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1em; margin-top: 12px; padding-top: 12px; border-top: 2px solid #eee;">
        <span>Total:</span>
        <span>₦${orderDetails.total.toLocaleString()}</span>
      </div>
    </div>
    
    <p style="margin-top: 20px;">We will notify you once your order has been shipped.</p>
    
    <p>Best regards,<br>EHR Clothing Team</p>
  `

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: `Order Confirmation - ${orderDetails.reference}`,
    html: emailTemplate(content),
  })
}