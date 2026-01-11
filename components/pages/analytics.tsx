"use client"

import { useFinance } from "@/context/finance-context"
import { useState, useEffect } from "react"

interface ExpenseByCategory {
  category: string
  amount: number
  icon: string
}

interface MonthlyData {
  month: string
  income: number
  expense: number
}

export default function AnalyticsPage() {
  const { transactions, categories } = useFinance()
  const [expenseByCategory, setExpenseByCategory] = useState<ExpenseByCategory[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])

  useEffect(() => {
    // Calculate expenses by category
    const categoryExpenses: Record<string, { amount: number; icon: string }> = {}

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const category = categories.find((c) => c.id === t.categoryId)
        if (category) {
          if (!categoryExpenses[category.name]) {
            categoryExpenses[category.name] = { amount: 0, icon: category.icon }
          }
          categoryExpenses[category.name].amount += t.amount
        }
      })

    const sorted = Object.entries(categoryExpenses)
      .map(([name, data]) => ({ category: name, ...data }))
      .sort((a, b) => b.amount - a.amount)

    setExpenseByCategory(sorted)

    // Calculate monthly income vs expense
    const monthlyMap: Record<string, { income: number; expense: number }> = {}

    transactions.forEach((t) => {
      const month = t.date.slice(0, 7) // YYYY-MM
      if (!monthlyMap[month]) {
        monthlyMap[month] = { income: 0, expense: 0 }
      }
      if (t.type === "income") {
        monthlyMap[month].income += t.amount
      } else {
        monthlyMap[month].expense += t.amount
      }
    })

    const monthly = Object.entries(monthlyMap)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6) // Last 6 months

    setMonthlyData(monthly)
  }, [transactions, categories])

  const total = expenseByCategory.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Tahlil</h1>

      {/* Expense by Category */}
      <div className="card mb-6">
        <div className="card-content">
          <h2 className="text-lg font-semibold mb-4">Kategoriya bo'yicha xarajat</h2>

          {expenseByCategory.length === 0 ? (
            <p className="text-muted-foreground py-4">Xarajat yo'q</p>
          ) : (
            <>
              <div className="space-y-3">
                {expenseByCategory.map((item) => {
                  const percentage = ((item.amount / total) * 100).toFixed(0)
                  return (
                    <div key={item.category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <span className="text-xl">{item.icon}</span>
                          {item.category}
                        </span>
                        <span className="text-sm font-semibold">{percentage}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-destructive h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{item.amount.toLocaleString()} so'm</div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center font-semibold">
                  <span>Jami xarajat:</span>
                  <span className="text-lg text-destructive">{total.toLocaleString()} so'm</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Monthly Income vs Expense */}
      <div className="card">
        <div className="card-content">
          <h2 className="text-lg font-semibold mb-4">Oylik daromad vs xarajat</h2>

          {monthlyData.length === 0 ? (
            <p className="text-muted-foreground py-4">Ma'lumot yo'q</p>
          ) : (
            <div className="space-y-4">
              {monthlyData.map((month) => {
                const maxValue = Math.max(month.income, month.expense)
                const incomePercent = (month.income / maxValue) * 100 || 0
                const expensePercent = (month.expense / maxValue) * 100 || 0

                return (
                  <div key={month.month}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{month.month}</span>
                      <span className="text-xs text-muted-foreground">
                        Balans: {(month.income - month.expense).toLocaleString()} so'm
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs w-12 text-success">💰</span>
                        <div className="flex-1 bg-secondary rounded h-2">
                          <div
                            className="bg-success h-2 rounded transition-all"
                            style={{ width: `${incomePercent}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold w-20 text-right">{month.income.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs w-12 text-destructive">💸</span>
                        <div className="flex-1 bg-secondary rounded h-2">
                          <div
                            className="bg-destructive h-2 rounded transition-all"
                            style={{ width: `${expensePercent}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold w-20 text-right">{month.expense.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
