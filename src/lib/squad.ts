
interface PaymentInitiationData {
    amount: number;
    email: string;
    reference: string;
    callbackUrl: string;
}
// const SQUAD_API_URL = 'https://sandbox-api-d.squadco.com'

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

export async function lookupAccount() {
    const response = await fetch('https://sandbox-api-d.squadco.com/payout/account/lookup', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.SQUAD_SECRET_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bank_code: "100004",
            account_number: "9163169949"
        })
    });

    return response.json();
}

export async function initiateTransfer(amount: number, remark: string) {
    const merchantId = process.env.SQUAD_MERCHANT_ID;
    const reference = `${merchantId}_${Date.now()}`;

    const response = await fetch('https://sandbox-api-d.squadco.com/payout/transfer', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.SQUAD_SECRET_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bank_code: "100004",
            account_number: "9163169949",
            account_name: "Robinson Honour",
            currency_id: "NGN",
            amount: amount.toString(),
            remark,
            transaction_reference: reference
        })
    });

    return response.json();
}

export async function getTransferHistory() {
    const response = await fetch('https://sandbox-api-d.squadco.com/payout/list', {
        headers: {
            'Authorization': `Bearer ${process.env.SQUAD_SECRET_KEY}`
        }
    });

    return response.json();
}



export async function verifyPayment(reference: string) {
    try {

        const response = await fetch(`https://sandbox-api-d.squadco.com/transaction/verify/${reference}`, {
            headers: {
                'Authorization': `Bearer ${process.env.SQUAD_SECRET_KEY}`,
            }
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Verification failed')
        }

        return await response.json()
    } catch (error: Error | unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to verify payment'
        console.error('Payment verification error:', error)
        throw new Error(errorMessage)
    }
}