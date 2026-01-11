"use client"

import type React from "react"
import { useState } from "react"
import { useFinance } from "@/context/finance-context"

interface CategoriesPageProps {
  onNavigate: (page: "dashboard" | "add" | "categories" | "transactions") => void
}

export default function CategoriesPage({ onNavigate }: CategoriesPageProps) {
  const { categories, addCategory, deleteCategory } = useFinance()
  const [type, setType] = useState<"income" | "expense">("expense")
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [icon, setIcon] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const filteredCategories = categories.filter((c) => c.type === type)

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !icon.trim()) return

    addCategory({
      name: name.trim(),
      icon,
      type,
    })

    setName("")
    setIcon("")
    setShowForm(false)
  }

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
    setShowConfirmation(true)
  }

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteCategory(deleteId)
      setDeleteId(null)
      setShowConfirmation(false)
    }
  }

  const defaultCategories = filteredCategories.filter((c) => c.isDefault)
  const customCategories = filteredCategories.filter((c) => !c.isDefault)

  return (
    <div className="p-4 space-y-4 pb-20">
      <h1 className="text-2xl font-bold text-balance">Kategoriyalar</h1>

      {/* Type Tabs */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setType("income")}
          className={`py-3 rounded-lg font-semibold transition-colors text-base ${
            type === "income" ? "bg-success text-success-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          📈 Daromad
        </button>
        <button
          onClick={() => setType("expense")}
          className={`py-3 rounded-lg font-semibold transition-colors text-base ${
            type === "expense" ? "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          📉 Xarajat
        </button>
      </div>

      {/* Default Categories */}
      {defaultCategories.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Standart Kategoriyalar
          </h2>
          <div className="space-y-2">
            {defaultCategories.map((cat) => (
              <div key={cat.id} className="card flex items-center justify-between gap-3">
                <span className="text-2xl flex-shrink-0">{cat.icon}</span>
                <span className="flex-1 text-base font-medium">{cat.name}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Asosiy</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Categories */}
      {customCategories.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Shaxsiy Kategoriyalar</h2>
          <div className="space-y-2">
            {customCategories.map((cat) => (
              <div key={cat.id} className="card flex items-center justify-between gap-3">
                <span className="text-2xl flex-shrink-0">{cat.icon}</span>
                <span className="flex-1 text-base font-medium">{cat.name}</span>
                <button
                  onClick={() => handleDeleteClick(cat.id)}
                  className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors flex-shrink-0"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Form */}
      {showForm ? (
        <form onSubmit={handleAddCategory} className="card space-y-3 sticky bottom-24 bg-card z-10 border-primary">
          <h2 className="text-lg font-semibold">Yangi Kategoriya Qo'shish</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">Kategoriya Nomi</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Kitoblar"
              className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground text-base placeholder:text-muted-foreground"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Emoji / Belgi (1-2 ta)</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value.slice(0, 2))}
              placeholder="😊"
              className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground text-center text-2xl"
              maxLength="2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setName("")
                setIcon("")
              }}
              className="py-3 rounded-lg border border-border font-semibold hover:bg-secondary transition-colors text-base"
            >
              Bekor qilish
            </button>
            <button type="submit" className="btn-primary text-base py-3 font-semibold">
              Qo'shish
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full btn-primary py-4 text-base font-semibold sticky bottom-24 z-10"
        >
          ➕ Yangi Kategoriya
        </button>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-20">
          <div className="w-full bg-card rounded-t-lg p-4 space-y-4 border-t border-border">
            <p className="font-semibold text-base">Kategoriyani o'chirishni xohlaysizmi?</p>
            <p className="text-sm text-muted-foreground">Bu kategoriya bilan bog'langan tranzaksiyalar saqlanadi.</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowConfirmation(false)}
                className="py-3 rounded-lg border border-border font-semibold hover:bg-secondary transition-colors text-base"
              >
                Bekor qilish
              </button>
              <button onClick={handleConfirmDelete} className="btn-destructive py-3 text-base font-semibold">
                Ha, O'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => onNavigate("dashboard")}
        className="w-full py-3 rounded-lg border border-border font-semibold hover:bg-secondary transition-colors text-base"
      >
        ← Ortga
      </button>
    </div>
  )
}
