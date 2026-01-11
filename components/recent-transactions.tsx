"use client"

import { useFinance } from "@/context/finance-context"

interface RecentTransactionsProps {
  onViewAll: () => void
}

export default function RecentTransactions({ onViewAll }: RecentTransactionsProps) {
  const { transactions, categories } = useFinance()

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  if (recentTransactions.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold">So'nggi Tranzaksiyalar</h3>
      <div className="space-y-2">
        {recentTransactions.map((transaction) => {
          const category = categories.find((c) => c.id === transaction.categoryId)
          const isIncome = transaction.type === "income"

          return (
            <div key={transaction.id} className="card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category?.icon}</span>
                <div>
                  <p className="font-medium">{category?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString("uz-UZ")}
                  </p>
                </div>
              </div>
              <p className={`font-bold ${isIncome ? "text-success" : "text-destructive"}`}>
                {isIncome ? "+" : "-"}
                {transaction.amount.toLocaleString("uz-UZ")} so'm
              </p>
            </div>
          )
        })}
      </div>
      <button onClick={onViewAll} className="w-full py-2 text-primary font-medium hover:underline">
        Barcha Tranzaksiyalarni Ko'rish →
      </button>
    </div>
  )
}
