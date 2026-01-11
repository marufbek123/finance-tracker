// Uzbek translations
export const uz = {
  dashboard: "Bosh sahifa",
  addTransaction: "Tranzaksiya qo'shish",
  categories: "Kategoriyalar",
  transactions: "Tranzaksiyalar",
  balance: "Balans",
  income: "Daromad",
  expense: "Xarajat",
  total: "Jami",
  date: "Sana",
  description: "Izoh",
  category: "Kategoriya",
  amount: "Miqdor",
  save: "Saqlash",
  cancel: "Bekor qilish",
  delete: "O'chirish",
  edit: "Tahrirlash",
  add: "Qo'shish",
  name: "Nomi",
  icon: "Belgi",
  newCategory: "Yangi kategoriya",
  enterAmount: "Miqdorni kiriting",
  enterDescription: "Izohni kiriting",
  selectCategory: "Kategoriya tanlang",
  incomeCategories: "Daromad kategoriyalari",
  expenseCategories: "Xarajat kategoriyalari",
  noTransactions: "Tranzaksiyalar yo'q",
  confirmDelete: "Haqiqatan o'chirishni xohlaysizmi?",
  error: "Xato",
  success: "Muvaffaqiyatli",
}

export interface Category {
  id: string
  name: string
  icon: string
  type: "income" | "expense"
  isDefault?: boolean
}

export interface Transaction {
  id: string
  type: "income" | "expense"
  categoryId: string
  amount: number
  description: string
  date: string
}

export interface FinanceData {
  transactions: Transaction[]
  categories: Category[]
}

const DEFAULT_CATEGORIES: Category[] = [
  // Income categories
  { id: "inc-1", name: "Ish haqi", icon: "💼", type: "income", isDefault: true },
  { id: "inc-2", name: "Freelance", icon: "💻", type: "income", isDefault: true },
  { id: "inc-3", name: "Savdo", icon: "🏪", type: "income", isDefault: true },
  { id: "inc-4", name: "Sovg'a", icon: "🎁", type: "income", isDefault: true },
  { id: "inc-5", name: "Boshqa", icon: "💰", type: "income", isDefault: true },

  // Expense categories
  { id: "exp-1", name: "Ovqat", icon: "🍕", type: "expense", isDefault: true },
  { id: "exp-2", name: "Transport", icon: "🚗", type: "expense", isDefault: true },
  { id: "exp-3", name: "Internet", icon: "📡", type: "expense", isDefault: true },
  { id: "exp-4", name: "Uy", icon: "🏠", type: "expense", isDefault: true },
  { id: "exp-5", name: "Kiyim", icon: "👔", type: "expense", isDefault: true },
  { id: "exp-6", name: "Ko'ngilochar", icon: "🎮", type: "expense", isDefault: true },
  { id: "exp-7", name: "Boshqa", icon: "🛒", type: "expense", isDefault: true },
]

const STORAGE_KEY = "finance_tracker_data"

export function getFinanceData(): FinanceData {
  if (typeof window === "undefined") {
    return { transactions: [], categories: DEFAULT_CATEGORIES }
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      const data = JSON.parse(stored)
      return {
        transactions: data.transactions || [],
        categories: data.categories || DEFAULT_CATEGORIES,
      }
    } catch {
      return { transactions: [], categories: DEFAULT_CATEGORIES }
    }
  }

  return { transactions: [], categories: DEFAULT_CATEGORIES }
}

export function saveFinanceData(data: FinanceData): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function addTransaction(transaction: Omit<Transaction, "id">): Transaction {
  const data = getFinanceData()
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
  }
  data.transactions.push(newTransaction)
  saveFinanceData(data)
  return newTransaction
}

export function deleteTransaction(id: string): void {
  const data = getFinanceData()
  data.transactions = data.transactions.filter((t) => t.id !== id)
  saveFinanceData(data)
}

export function addCategory(category: Omit<Category, "id">): Category {
  const data = getFinanceData()
  const newCategory: Category = {
    ...category,
    id: Date.now().toString(),
  }
  data.categories.push(newCategory)
  saveFinanceData(data)
  return newCategory
}

export function deleteCategory(id: string): void {
  const data = getFinanceData()
  data.categories = data.categories.filter((c) => c.id !== id)
  saveFinanceData(data)
}
