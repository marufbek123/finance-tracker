"use client"

import { useState } from "react"
import { FinanceProvider } from "@/context/finance-context"
import Navigation from "@/components/navigation"
import Dashboard from "@/components/pages/dashboard"
import AddTransactionPage from "@/components/pages/add-transaction"
import CategoriesPage from "@/components/pages/categories"
import TransactionsPage from "@/components/pages/transactions"
import AnalyticsPage from "@/components/pages/analytics"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "add" | "categories" | "transactions" | "analytics">(
    "dashboard",
  )

  return (
    <FinanceProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <main className="flex-1 overflow-y-auto pb-20">
          {currentPage === "dashboard" && <Dashboard onNavigate={setCurrentPage} />}
          {currentPage === "add" && <AddTransactionPage onNavigate={setCurrentPage} />}
          {currentPage === "categories" && <CategoriesPage onNavigate={setCurrentPage} />}
          {currentPage === "transactions" && <TransactionsPage onNavigate={setCurrentPage} />}
          {currentPage === "analytics" && <AnalyticsPage />}
        </main>
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>
    </FinanceProvider>
  )
}
