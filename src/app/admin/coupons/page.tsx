'use client'

import { useState, useEffect, FormEvent } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

interface Coupon {
  id: string
  code: string
  discount: number
  type: 'percentage' | 'fixed'
  minPurchase: number
  maxUses: number
  usedCount: number
  validFrom: string
  validUntil: string
  status: 'active' | 'expired' | 'draft'
}

export default function CouponsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    code: '',
    discount: 0,
    type: 'percentage',
    minPurchase: 0,
    maxUses: 100,
    validFrom: '',
    validUntil: '',
    status: 'active'
  })

  // Fetch coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/admin/coupons')
        if (!response.ok) throw new Error('Failed to fetch coupons')
        const data = await response.json()
        setCoupons(data)
      } catch (error) {
        console.error('Error fetching coupons:', error)
        toast.error('Failed to load coupons')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCoupons()
  }, [])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    })
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      code: '',
      discount: 0,
      type: 'percentage',
      minPurchase: 0,
      maxUses: 100,
      validFrom: '',
      validUntil: '',
      status: 'active'
    })
  }

  // Open modal for editing
  const handleEditCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setFormData({
      code: coupon.code,
      discount: coupon.discount,
      type: coupon.type,
      minPurchase: coupon.minPurchase,
      maxUses: coupon.maxUses,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      status: coupon.status
    })
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const url = selectedCoupon 
        ? `/api/admin/coupons/${selectedCoupon.id}` 
        : '/api/admin/coupons'
      
      const method = selectedCoupon ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error('Failed to save coupon')
      
      const savedCoupon = await response.json()
      
      if (selectedCoupon) {
        // Update existing coupon in the list
        setCoupons(coupons.map(c => c.id === savedCoupon.id ? savedCoupon : c))
        toast.success('Coupon updated successfully')
      } else {
        // Add new coupon to the list
        setCoupons([...coupons, savedCoupon])
        toast.success('Coupon created successfully')
      }
      
      // Close modal and reset form
      setIsAddModalOpen(false)
      setSelectedCoupon(null)
      resetForm()
    } catch (error) {
      console.error('Error saving coupon:', error)
      toast.error('Failed to save coupon')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle coupon deletion
  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return
    
    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete coupon')
      
      // Remove coupon from the list
      setCoupons(coupons.filter(c => c.id !== id))
      toast.success('Coupon deleted successfully')
    } catch (error) {
      console.error('Error deleting coupon:', error)
      toast.error('Failed to delete coupon')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'expired': return 'bg-red-100 text-red-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB')
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading coupons...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Coupons</h1>
        <button
          onClick={() => {
            resetForm()
            setIsAddModalOpen(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="w-5 h-5" />
          Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {coupons.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No coupons found. Create your first coupon to get started.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Purchase</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid Until</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                    <div className="text-sm text-gray-500">ID: {coupon.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {coupon.type === 'percentage' ? (
                      <span>{coupon.discount}% OFF</span>
                    ) : (
                      <span>₦{coupon.discount.toLocaleString()} OFF</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₦{coupon.minPurchase.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {coupon.usedCount} / {coupon.maxUses}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(coupon.validUntil)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(coupon.status)}`}>
                      {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEditCoupon(coupon)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Coupon Modal */}
      {(isAddModalOpen || selectedCoupon) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">
              {selectedCoupon ? 'Edit Coupon' : 'Add New Coupon'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium mb-1">Coupon Code</label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., WELCOME20"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium mb-1">Discount Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="discount" className="block text-sm font-medium mb-1">Discount Value</label>
                  <input
                    id="discount"
                    name="discount"
                    type="number"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Enter amount"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="minPurchase" className="block text-sm font-medium mb-1">Minimum Purchase</label>
                  <input
                    id="minPurchase"
                    name="minPurchase"
                    type="number"
                    value={formData.minPurchase}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Enter amount"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="validFrom" className="block text-sm font-medium mb-1">Valid From</label>
                  <input
                    id="validFrom"
                    name="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="validUntil" className="block text-sm font-medium mb-1">Valid Until</label>
                  <input
                    id="validUntil"
                    name="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="maxUses" className="block text-sm font-medium mb-1">Maximum Uses</label>
                  <input
                    id="maxUses"
                    name="maxUses"
                    type="number"
                    value={formData.maxUses}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Enter limit"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false)
                    setSelectedCoupon(null)
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{selectedCoupon ? 'Updating...' : 'Creating...'}</span>
                    </>
                  ) : (
                    <span>{selectedCoupon ? 'Update Coupon' : 'Create Coupon'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}