"use client"

import { useState } from "react"
import { useFinance } from "@/context/finance-context"
import TransactionItem from "@/components/transaction-item"

interface TransactionsPageProps {
  onNavigate: (page: "dashboard" | "add" | "categories" | "transactions") => void
}

export default function TransactionsPage({ onNavigate }: TransactionsPageProps) {
  const { transactions, categories, deleteTransaction, isLoaded } = useFinance()
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStartDate, setFilterStartDate] = useState<string>("")
  const [filterEndDate, setFilterEndDate] = useState<string>("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  if (!isLoaded) {
    return <div className="p-4">Yuklanmoqda...</div>
  }

  const filteredTransactions = transactions
    .filter((t) => (filterType === "all" ? true : t.type === filterType))
    .filter((t) => (filterCategory === "all" ? true : t.categoryId === filterCategory))
    .filter((t) => {
      if (!filterStartDate && !filterEndDate) return true
      const txDate = new Date(t.date).getTime()
      const startDate = filterStartDate ? new Date(filterStartDate).getTime() : 0
      const endDate = filterEndDate ? new Date(filterEndDate).getTime() + 86400000 : Number.POSITIVE_INFINITY
      return txDate >= startDate && txDate <= endDate
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Get available categories for current filter
  const availableCategories = categories.filter((c) => filterType === "all" || c.type === filterType)

  const summaryAmount = filteredTransactions.reduce((sum, t) => {
    return t.type === "income" ? sum + t.amount : sum - t.amount
  }, 0)

  return (
    <div className="p-4 space-y-4 pt-6">
      <h1 className="text-2xl font-bold">Tranzaksiyalar</h1>

      {/* Type Filter Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {["all", "income", "expense"].map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilterType(f as any)
              setFilterCategory("all")
            }}
            className={`py-2 rounded-lg font-medium transition-colors text-sm ${
              filterType === f
                ? f === "income"
                  ? "bg-success text-success-foreground"
                  : f === "expense"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {f === "all" && "📋 Hammasi"}
            {f === "income" && "📈 Daromad"}
            {f === "expense" && "📉 Xarajat"}
          </button>
        ))}
      </div>

      {/* Category Filter Dropdown */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Toifa bo'yicha filtrlash</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full px-3 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Barcha toifalar</option>
          {availableCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Filters */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Sana bo'yicha filtrlash</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground">Boshlanishi:</label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="w-full px-3 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Tugashi:</label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="w-full px-3 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
        </div>
      </div>

      {/* Summary of Filtered Results */}
      {filteredTransactions.length > 0 && (
        <div className="card bg-secondary/30">
          <p className="text-xs text-muted-foreground">Filtrlash natijasi</p>
          <p className={`text-lg font-bold ${summaryAmount >= 0 ? "text-success" : "text-destructive"}`}>
            {summaryAmount >= 0 ? "+" : ""}
            {summaryAmount.toLocaleString("uz-UZ")} so'm
          </p>
        </div>
      )}

      {/* Transactions List */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Tranzaksiyalar yo'q</p>
        ) : (
          filteredTransactions.map((transaction) => {
            const category = categories.find((c) => c.id === transaction.categoryId)
            return (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                category={category}
                onDelete={() => setDeleteId(transaction.id)}
              />
            )
          })
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="card space-y-3 border-destructive">
          <p className="font-medium">Haqiqatan o'chirishni xohlaysizmi?</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDeleteId(null)}
              className="py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
            >
              Yo'q
            </button>
            <button
              onClick={() => {
                deleteTransaction(deleteId)
                setDeleteId(null)
              }}
              className="btn-destructive"
            >
              Ha, O'chirish
            </button>
          </div>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => onNavigate("dashboard")}
        className="w-full py-3 rounded-lg border border-border font-medium hover:bg-secondary transition-colors"
      >
        ← Ortga
      </button>
    </div>
  )
}
