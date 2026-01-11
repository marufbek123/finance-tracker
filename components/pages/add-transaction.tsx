"use client"

import type React from "react"

import { useState } from "react"
import { useFinance } from "@/context/finance-context"

interface AddTransactionPageProps {
  onNavigate: (page: "dashboard" | "add" | "categories" | "transactions") => void
}

export default function AddTransactionPage({ onNavigate }: AddTransactionPageProps) {
  const { addTransaction, categories } = useFinance()
  const [type, setType] = useState<"income" | "expense">("expense")
  const [categoryId, setCategoryId] = useState("")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [showConfirmation, setShowConfirmation] = useState(false)

  const filteredCategories = categories.filter((c) => c.type === type)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryId || !amount) return

    addTransaction({
      type,
      categoryId,
      amount: Number.parseFloat(amount),
      description: note,
      date,
    })

    setShowConfirmation(true)
    setAmount("")
    setNote("")
    setCategoryId("")
    setDate(new Date().toISOString().split("T")[0])

    // Auto-hide confirmation after 2 seconds
    setTimeout(() => {
      setShowConfirmation(false)
      onNavigate("dashboard")
    }, 2000)
  }

  return (
    <div className="p-4 space-y-6 pt-6">
      <h1 className="text-3xl font-bold text-foreground">Tranzaksiya Qo'shish</h1>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-end pointer-events-none">
          <div className="w-full mx-4 mb-24 bg-success text-success-foreground p-4 rounded-lg shadow-lg pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-bold">Muvaffaqiyatli saqlandi!</p>
                <p className="text-sm opacity-90">Tranzaksiya qo'shildi</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type Selection - Large buttons for mobile */}
        <div className="space-y-3">
          <label className="block text-base font-semibold text-foreground">Turi</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setType("income")
                setCategoryId("")
              }}
              className={`py-4 px-4 rounded-lg font-bold text-lg transition-all duration-200 ${
                type === "income"
                  ? "bg-success text-success-foreground shadow-md scale-105"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <span className="text-2xl mr-2">📈</span>
              Daromad
            </button>
            <button
              type="button"
              onClick={() => {
                setType("expense")
                setCategoryId("")
              }}
              className={`py-4 px-4 rounded-lg font-bold text-lg transition-all duration-200 ${
                type === "expense"
                  ? "bg-destructive text-destructive-foreground shadow-md scale-105"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <span className="text-2xl mr-2">📉</span>
              Xarajat
            </button>
          </div>
        </div>

        {/* Amount Input - Large and prominent */}
        <div className="space-y-3">
          <label className="block text-base font-semibold text-foreground">Miqdor (so'm)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full px-4 py-4 text-lg rounded-lg border-2 border-border bg-input text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
            required
            step="0.01"
            min="0"
            inputMode="decimal"
          />
        </div>

        {/* Category Selection - Large dropdown */}
        <div className="space-y-3">
          <label className="block text-base font-semibold text-foreground">Kategoriya</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-4 text-lg rounded-lg border-2 border-border bg-input text-foreground focus:border-primary focus:outline-none transition-colors"
            required
          >
            <option value="">Kategoriya tanlang...</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Input - Default to today */}
        <div className="space-y-3">
          <label className="block text-base font-semibold text-foreground">Sana</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-4 text-lg rounded-lg border-2 border-border bg-input text-foreground focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Note Input - Optional */}
        <div className="space-y-3">
          <label className="block text-base font-semibold text-foreground">Izoh (ixtiyoriy)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Izoh kiriting..."
            className="w-full px-4 py-4 text-base rounded-lg border-2 border-border bg-input text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none"
            rows={4}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-6 pb-4">
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="py-4 px-4 rounded-lg border-2 border-border font-bold text-lg hover:bg-secondary transition-colors"
          >
            Bekor Qilish
          </button>
          <button
            type="submit"
            className="py-4 px-4 rounded-lg bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors shadow-md"
          >
            Saqlash
          </button>
        </div>
      </form>
    </div>
  )
}
