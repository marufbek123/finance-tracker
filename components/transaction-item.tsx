"use client"

import type { Transaction, Category } from "@/lib/storage"

interface TransactionItemProps {
  transaction: Transaction
  category?: Category
  onDelete: () => void
}

export default function TransactionItem({ transaction, category, onDelete }: TransactionItemProps) {
  const isIncome = transaction.type === "income"

  return (
    <div className="card flex items-center justify-between group hover:bg-secondary/50 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <span className="text-2xl">{category?.icon}</span>
        <div className="flex-1">
          <p className="font-medium">{category?.name}</p>
          {transaction.description && <p className="text-sm text-muted-foreground">{transaction.description}</p>}
          <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString("uz-UZ")}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className={`font-bold ${isIncome ? "text-success" : "text-destructive"}`}>
          {isIncome ? "+" : "-"}
          {transaction.amount.toLocaleString("uz-UZ")} so'm
        </p>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 p-1 rounded"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
