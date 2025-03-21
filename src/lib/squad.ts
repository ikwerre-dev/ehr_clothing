interface PaymentInitiationData {
    amount: number;
    email: string;
    reference: string;
    callbackUrl: string;
}

export async function initializePayment(data: PaymentInitiationData) {
    const response = await fetch('https://sandbox-api-d.squadco.com/transaction/initiate', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.SQUAD_SECRET_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: data.amount,
            email: data.email,
            currency: 'NGN',
            initiate_type: 'inline',
            transaction_ref: data.reference,
            callback_url: data.callbackUrl
        })
    });

     if (!response.ok) {
        throw new Error('Failed to initialize payment');
    }

    return response.json();
}