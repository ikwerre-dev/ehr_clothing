import { Category } from "@prisma/client/wasm"

 
export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: Category
  categoryId: string
  stock: number
  createdAt: Date
  updatedAt: Date
}