"use client"

import { useFinance } from "@/context/finance-context"
import StatCard from "@/components/stat-card"
import RecentTransactions from "@/components/recent-transactions"

interface DashboardProps {
  onNavigate: (page: "dashboard" | "add" | "categories" | "transactions") => void
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { balance, totalIncome, totalExpense, todayExpense, monthExpense, isLoaded } = useFinance()

  if (!isLoaded) {
    return <div className="p-4">Yuklanmoqda...</div>
  }

  return (
    <div className="p-4 space-y-6">
      <header className="pt-4">
        <h1 className="text-3xl font-bold">Moliya Tracker</h1>
        <p className="text-muted-foreground">Daromad va xarajatlarni boshqaring</p>
      </header>

      {/* Balance Card */}
      <div className="card bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <p className="text-sm opacity-90">Umumiy Balans</p>
        <h2 className="text-4xl font-bold mt-2">{balance.toLocaleString("uz-UZ")} so'm</h2>
      </div>

      {/* Income & Expense Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon="📈" label="Daromad" amount={totalIncome} color="success" />
        <StatCard icon="📉" label="Xarajat" amount={totalExpense} color="destructive" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon="📅" label="Bugun Xarajat" amount={todayExpense} color="destructive" />
        <StatCard icon="📊" label="Oy Xarajat" amount={monthExpense} color="destructive" />
      </div>

      {/* Quick Action */}
      <button onClick={() => onNavigate("add")} className="btn-primary w-full">
        ➕ Tranzaksiya Qo'shish
      </button>

      {/* Recent Transactions */}
      <RecentTransactions onViewAll={() => onNavigate("transactions")} />
    </div>
  )
}
