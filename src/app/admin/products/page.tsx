'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface Product {
    id: string
    name: string
    description: string
    price: number
    images: string[]
    stock: number
    category: {
        id: string
        name: string
    }
}

interface Category {
    id: string;
    name: string;
}

export default function ProductsPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [newProduct, setNewProduct] = useState({
        title: '',
        price: '',
        description: '',
        image: '',
        categoryId: '',
        stock: '0',
    })

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)


    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        fetchProducts()
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/admin/categories')
            const data = await response.json()
            setCategories(data)
        } catch (error) {
            console.error('Failed to fetch categories:', error)
        }
    }

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/admin/products')
            const data = await response.json()
            setProducts(data)
        } catch (error) {
            console.error('Failed to fetch products:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Add new state at the top with other states
    const [deletingProductId, setDeletingProductId] = useState<string | null>(null)

    // Add handleDelete function
    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        setDeletingProductId(productId)
        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to delete product')
            }

            setProducts(products.filter(p => p.id !== productId))
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("An unknown error occurred");
            }
        } finally {
            setDeletingProductId(null)
        }
    }


    const [isSubmitting, setIsSubmitting] = useState(false)

    // Update handleAddProduct function
    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to add product')
            }

            const newProductData = await response.json()
            setProducts([...products, newProductData])
            setIsAddModalOpen(false)
            setNewProduct({
                title: '',
                price: '',
                description: '',
                image: '',
                categoryId: '',
                stock: '0',
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("An unknown error occurred");
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    // Add new state for image upload
    const [imageUploading, setImageUploading] = useState(false)

    // Add image upload handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setImageUploading(true)
        const formData = new FormData()
        formData.append('image', file)

        try {
            const response = await fetch('https://swissindextrade.pro/upload_system/upload.php', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()
            console.log(data)
            if (data.status === 'success') {
                setNewProduct({ ...newProduct, image: data.url })
            } else {
                alert('Failed to upload image')
            }
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Failed to upload image')
        } finally {
            setImageUploading(false)
        }
    }

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingProduct) return
        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: editingProduct.name,
                    description: editingProduct.description,
                    price: editingProduct.price,
                    image: editingProduct.images[0],
                    categoryId: editingProduct.category.id,
                    stock: editingProduct.stock,
                }),
            })

            if (response.ok) {
                const updatedProduct = await response.json()
                setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p))
                setIsEditModalOpen(false)
                setEditingProduct(null)
            }
        } catch (error) {
            console.error('Failed to update product:', error)
        }
        setIsSubmitting(false)

    }

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
            </div>
        )
    }


    // Add Edit Modal
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Products</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden">
                                            <Image width={250} height={3} src={product.images[0]} alt="" className="h-full w-full object-cover" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            <div className="text-sm text-gray-500">ID: {product.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">₦{product.price.toLocaleString()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{product.stock}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setEditingProduct(product)
                                            setIsEditModalOpen(true)
                                        }}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        disabled={deletingProductId === product.id}
                                        className={`text-red-600 hover:text-red-900 ${deletingProductId === product.id ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        {deletingProductId === product.id ? (
                                            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <TrashIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-hidden">
                    <div className="relative w-full max-w-2xl">
                        <div className="bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold">Add New Product</h2>
                            </div>
                            <div className="flex-1 overflow-y-auto px-6 pb-6">
                                <form onSubmit={handleAddProduct} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={newProduct.title}
                                            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Price</label>
                                            <input
                                                type="number"
                                                value={newProduct.price}
                                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                                className="w-full p-2 border rounded"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Category</label>
                                            <select
                                                value={newProduct.categoryId}
                                                onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                                                className="w-full p-2 border rounded"
                                                required
                                            >
                                                <option value="">Select category</option>
                                                {categories.map(category => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Description</label>
                                        <textarea
                                            value={newProduct.description}
                                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                            className="w-full p-2 border rounded"
                                            rows={4}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Product Image</label>
                                        <div className="space-y-4">
                                            {newProduct.image ? (
                                                <div className="w-40 h-40 rounded-lg overflow-hidden bg-gray-100 border">
                                                    <Image width={250} height={3} src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-40 h-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                                                    <div className="text-center">
                                                        <div className="text-gray-500">
                                                            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </div>
                                                        <p className="mt-1 text-sm text-gray-500">Click to upload image</p>
                                                    </div>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="product-image"
                                                disabled={imageUploading}
                                                required={!newProduct.image}
                                            />
                                            <label
                                                htmlFor="product-image"
                                                className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${imageUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                                    }`}
                                            >
                                                {imageUploading ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-5 h-5 mr-2" />
                                                        {newProduct.image ? 'Change Image' : 'Upload Image'}
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Stock</label>
                                        <input
                                            type="number"
                                            value={newProduct.stock}
                                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                            className="w-full p-2 border rounded"
                                            required
                                            min="0"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={imageUploading || isSubmitting}
                                            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 ${(imageUploading || isSubmitting) ? 'cursor-not-allowed' : ''
                                                }`}
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    Adding...
                                                </div>
                                            ) : (
                                                'Add Product'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-hidden">
                    <div className="relative w-full max-w-2xl">
                        <div className="bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold">Edit Product</h2>
                            </div>
                            <div className="flex-1 overflow-y-auto px-6 pb-6">
                                <form onSubmit={handleEdit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={editingProduct.name}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Price</label>
                                            <input
                                                type="number"
                                                value={editingProduct.price}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                                                className="w-full p-2 border rounded"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Category</label>
                                            <select
                                                value={editingProduct.category.id}
                                                onChange={(e) => setEditingProduct({
                                                    ...editingProduct,
                                                    category: { ...editingProduct.category, id: e.target.value }
                                                })}
                                                className="w-full p-2 border rounded"
                                                required
                                            >
                                                {categories.map(category => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Description</label>
                                        <textarea
                                            value={editingProduct.description}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                            className="w-full p-2 border rounded"
                                            rows={4}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Product Image</label>
                                        <div className="space-y-4">
                                            {editingProduct.images[0] ? (
                                                <div className="w-40 h-40 rounded-lg overflow-hidden bg-gray-100 border">
                                                    <Image width={250} height={3} src={editingProduct.images[0]} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-40 h-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                                                    <div className="text-center">
                                                        <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <p className="mt-1 text-sm text-gray-500">Click to upload image</p>
                                                    </div>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0]
                                                    if (!file) return

                                                    setImageUploading(true)
                                                    const formData = new FormData()
                                                    formData.append('image', file)

                                                    try { 
                                                        const response = await fetch('https://swissindextrade.pro/upload_system/upload.php', {
                                                            method: 'POST',
                                                            body: formData,
                                                        })

                                                        const data = await response.json()
                                                        if (data.status === 'success') {
                                                            setEditingProduct({
                                                                ...editingProduct,
                                                                images: [data.url]
                                                            })
                                                        }
                                                    } catch (error) {
                                                        console.error('Error uploading image:', error)
                                                        alert('Failed to upload image')
                                                    } finally {
                                                        setImageUploading(false)
                                                    }
                                                }}
                                                className="hidden"
                                                id="edit-product-image"
                                            />
                                            <label
                                                htmlFor="edit-product-image"
                                                className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${imageUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                                    }`}
                                            >
                                                {imageUploading ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <PlusIcon className="w-5 h-5 mr-2" />
                                                        Change Image
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Stock</label>
                                        <input
                                            type="number"
                                            value={editingProduct.stock}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                                            className="w-full p-2 border rounded"
                                            required
                                            min="0"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditModalOpen(false)
                                                setEditingProduct(null)
                                            }}
                                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={imageUploading || isSubmitting}
                                            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 ${(imageUploading || isSubmitting) ? 'cursor-not-allowed' : ''
                                                }`}
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    Updating...
                                                </div>
                                            ) : (
                                                'Update Product'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )

}

