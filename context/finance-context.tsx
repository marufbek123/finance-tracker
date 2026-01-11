"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  getFinanceData,
  addTransaction as addTransactionUtil,
  deleteTransaction as deleteTransactionUtil,
  addCategory as addCategoryUtil,
  deleteCategory as deleteCategoryUtil,
  type Transaction,
  type Category,
  type FinanceData,
} from "@/lib/storage"

interface FinanceContextType {
  transactions: Transaction[]
  categories: Category[]
  balance: number
  totalIncome: number
  totalExpense: number
  todayExpense: number
  monthExpense: number
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  deleteTransaction: (id: string) => void
  addCategory: (category: Omit<Category, "id">) => void
  deleteCategory: (id: string) => void
  isLoaded: boolean
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<FinanceData>({ transactions: [], categories: [] })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loaded = getFinanceData()
    setData(loaded)
    setIsLoaded(true)
  }, [])

  const totalIncome = data.transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = data.transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const today = new Date().toISOString().split("T")[0]
  const todayExpense = data.transactions
    .filter((t) => t.type === "expense" && t.date === today)
    .reduce((sum, t) => sum + t.amount, 0)

  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthExpense = data.transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = addTransactionUtil(transaction)
    setData((prev) => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction],
    }))
  }

  const handleDeleteTransaction = (id: string) => {
    deleteTransactionUtil(id)
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }))
  }

  const handleAddCategory = (category: Omit<Category, "id">) => {
    const newCategory = addCategoryUtil(category)
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }))
  }

  const handleDeleteCategory = (id: string) => {
    deleteCategoryUtil(id)
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
    }))
  }

  return (
    <FinanceContext.Provider
      value={{
        transactions: data.transactions,
        categories: data.categories,
        balance,
        totalIncome,
        totalExpense,
        todayExpense,
        monthExpense,
        addTransaction: handleAddTransaction,
        deleteTransaction: handleDeleteTransaction,
        addCategory: handleAddCategory,
        deleteCategory: handleDeleteCategory,
        isLoaded,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error("useFinance must be used within FinanceProvider")
  }
  return context
}
