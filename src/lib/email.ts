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

export async function sendOrderConfirmationEmail(
  email: string,
  orderDetails: {
    reference: string
    customerName: string
    items: any[]
    total: number
    subtotal: number
    shipping: number
  }
) {
  const emailContent = `
    <h1>Order Confirmation</h1>
    <p>Dear ${orderDetails.customerName},</p>
    <p>Thank you for your order! Your order has been received and payment has been initiated.</p>
    
    <h2>Order Details</h2>
    <p>Order Reference: ${orderDetails.reference}</p>
    
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
    <p>Total: ₦${orderDetails.total.toLocaleString()}</p>
    
    <p>We will notify you once your order has been shipped.</p>
    
    <p>Best regards,<br>EHR Clothing Team</p>
  `

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: `Order Confirmation - ${orderDetails.reference}`,
    html: emailContent,
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
    <p>Total: ₦${orderDetails.total.toLocaleString()}</p>
  `

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: 'codewithhonour@gmail.com',
    subject: `New Order Alert - ${orderDetails.reference}`,
    html: emailContent,
  })
}