'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

interface Category {
  id: string
  name: string
  description: string | null
  _count: {
    products: number
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Add isSubmitting state
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Update handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories'
      
      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
  
      if (response.ok) {
        await fetchCategories()
        setIsModalOpen(false)
        setEditingCategory(null)
        setFormData({ name: '', description: '' })
      }
    } catch (error) {
      console.error('Failed to save category:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Update the submit button in the form
  <div className="flex justify-end gap-4">
    <button
      type="button"
      onClick={() => setIsModalOpen(false)}
      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isSubmitting}
      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center ${
        isSubmitting ? 'cursor-not-allowed' : ''
      }`}
    >
      {isSubmitting ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading...
        </>
      ) : (
        editingCategory ? 'Update' : 'Create'
      )}
    </button>
  </div>

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return
  
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE'
      })
  
      console.log(response)
      const data = await response.json()
  
      if (response.ok) {
        await fetchCategories()
      } else {
        alert(data.error || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert('Failed to delete category')
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <button
          onClick={() => {
            setEditingCategory(null)
            setFormData({ name: '', description: '' })
            setIsModalOpen(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="w-5 h-5" />
          Add Category
        </button>
      </div>

       <div className="bg-white rounded-lg  shadow overflow-hidden">
      <div className="overflow-scroll">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{category.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">{category.description || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{category._count.products}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => {
                      setEditingCategory(category)
                      setFormData({
                        name: category.name,
                        description: category.description || ''
                      })
                      setIsModalOpen(true)
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center ${
                    isSubmitting ? 'cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    editingCategory ? 'Update' : 'Create'
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