'use client'

import { useState, useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import {
  EyeIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface Transaction {
  id: string
  reference: string
  paymentMethod: string
  total: number
  paymentStatus: string
  paymentReference: string
  createdAt: string
  user: {
    name: string
    email: string
  }
}

interface VerificationData {
  data: {
    transaction_amount?: number;
    email?: string;
    transaction_status?: string;
    created_at?: string;
    [key: string]: string | number | undefined; // More specific type for additional fields
  };
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null)
  const [verifying, setVerifying] = useState(false)
  const itemsPerPage = 10;
  useEffect(() => {
    
    console.log(loading)
  },[loading])

   useEffect(() => {
    if (selectedTransaction) {
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'auto'; // Restore scrolling when modal closes
    }


    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedTransaction]);

  // Move fetchTransactions inside useEffect or use useCallback
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch(`/api/admin/transactions?page=${currentPage}&limit=10`)
        const data = await res.json()
        setTransactions(data.transactions)
        setTotalPages(data.pages)
      } catch (error) {
        toast.error('Failed to fetch transactions')
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [currentPage])

  async function verifyTransaction(reference: string) {
    setVerifying(true)
    try {
      const res = await fetch('/api/admin/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference })
      })
      const data = await res.json()
      setVerificationData(data)
    } catch (error) {
      toast.error('Failed to verify transaction')
      console.log(error)

    } finally {
      setVerifying(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'unpaid': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'abandoned':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'flagged':
        return 'bg-orange-100 text-orange-800'
      case 'reversed':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6 md:p-6">
      <h1 className="text-2xl font-semibold">Transactions</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm">
                    <button
                      onClick={() => {
                        setSelectedTransaction(transaction)
                        verifyTransaction(transaction.reference)
                      }}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <EyeIcon className="w-4 h-4" />
                      Verify
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.paymentStatus)}`}>
                      {transaction.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.reference}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">₦{transaction.total.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex bg-black/50 h-screen items-center justify-center">
          <div className="bg-white rounded-xl p-4 w-full max-w-[90%] sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Transaction Details</h2>
              <button
                onClick={() => {
                  setSelectedTransaction(null)
                  setVerificationData(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {verifying ? (
              <div className="flex items-center justify-center py-6">
                <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : verificationData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {verificationData?.data && Object.entries(verificationData.data)
                    .filter(([key]) => ['transaction_amount', 'email', 'transaction_status', 'created_at'].includes(key))
                    .map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1 capitalize">{key.replace(/_/g, ' ')}</p>
                        <p
                          className={`font-medium text-sm p-2 rounded-lg ${key === 'transaction_status' &&
                            getPaymentStatusColor(typeof value === 'object' ? JSON.stringify(value) : String(value))
                            }`}
                        >
                          {key === 'transaction_amount' && typeof value === 'number'
                            ? `₦${(value / 100).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : typeof value === 'object'
                              ? JSON.stringify(value)
                              : String(value)}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <p className="text-sm">No verification data available</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, transactions.length)}</span> of{' '}
              <span className="font-medium">{transactions.length}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === i + 1
                    ? 'bg-blue-600 text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  )
}