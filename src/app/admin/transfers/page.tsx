// 'use client'

// import { useState, useEffect } from 'react'
// import { useForm } from 'react-hook-form'

// interface TransferHistory {
//     account_number_credited: string
//     amount_debited: string
//     recipient: string
//     transaction_status: string
//     transaction_reference: string
// }

// export default function TransfersPage() {
//     const [balance] = useState<number>(0)
//     const [history, setHistory] = useState<TransferHistory[]>([])
//     const [loading, setLoading] = useState(false)
//     const { register, handleSubmit, reset } = useForm()

//     useEffect(() => {
//         fetchTransferHistory()
//     }, [])

//     const fetchTransferHistory = async () => {
//         try {
//             const response = await fetch('/api/admin/transfers')
//             const data = await response.json()
//             if (data.success) {
//                 setHistory(data.data)
//             }
//         } catch (error) {
//             console.error('Failed to fetch history:', error)
//         }
//     }

//     const onSubmit = async (data: any) => {
//         setLoading(true)
//         try {
//             const response = await fetch('/api/admin/transfers', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(data)
//             })
//             const result = await response.json()
//             if (result.success) {
//                 reset()
//                 fetchTransferHistory()
//             }
//         } catch (error) {
//             console.error('Transfer failed:', error)
//         }
//         setLoading(false)
//     }

//     return (
//         <div className="p-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                 <div className="bg-white p-6 rounded-lg shadow">
//                     <h2 className="text-2xl font-bold mb-4">Account Balance</h2>
//                     <p className="text-3xl font-bold">₦{balance.toLocaleString()}</p>
//                 </div>
                
//                 <div className="bg-white p-6 rounded-lg shadow">
//                     <h2 className="text-2xl font-bold mb-4">Request Transfer</h2>
//                     <form onSubmit={handleSubmit(onSubmit)}>
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Amount (₦)</label>
//                                 <input
//                                     type="number"
//                                     {...register('amount', { required: true })}
//                                     className="w-full p-2 border rounded"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Remark</label>
//                                 <input
//                                     type="text"
//                                     {...register('remark', { required: true })}
//                                     className="w-full p-2 border rounded"
//                                 />
//                             </div>
//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
//                             >
//                                 {loading ? 'Processing...' : 'Request Transfer'}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>

//             <div className="bg-white rounded-lg shadow overflow-hidden">
//                 <h2 className="text-2xl font-bold p-6 border-b">Transfer History</h2>
//                 <div className="overflow-x-auto">
//                     <table className="w-full">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                             {history.map((transfer) => (
//                                 <tr key={transfer.transaction_reference}>
//                                     <td className="px-6 py-4 text-sm">{transfer.transaction_reference}</td>
//                                     <td className="px-6 py-4 text-sm">₦{parseInt(transfer.amount_debited).toLocaleString()}</td>
//                                     <td className="px-6 py-4 text-sm">{transfer.recipient}</td>
//                                     <td className="px-6 py-4 text-sm">
//                                         <span className={`px-2 py-1 rounded-full text-xs ${
//                                             transfer.transaction_status === 'success' 
//                                                 ? 'bg-green-100 text-green-800'
//                                                 : 'bg-yellow-100 text-yellow-800'
//                                         }`}>
//                                             {transfer.transaction_status}
//                                         </span>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     )
// }