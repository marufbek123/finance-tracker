"use client"

type Page = "dashboard" | "add" | "categories" | "transactions" | "analytics"

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="grid grid-cols-5 gap-1 p-2 max-w-2xl mx-auto">
        <NavItem
          icon="📊"
          label="Bosh"
          isActive={currentPage === "dashboard"}
          onClick={() => onNavigate("dashboard")}
        />
        <NavItem icon="➕" label="Qo'sh" isActive={currentPage === "add"} onClick={() => onNavigate("add")} />
        <NavItem
          icon="📈"
          label="Tahlil"
          isActive={currentPage === "analytics"}
          onClick={() => onNavigate("analytics")}
        />
        <NavItem
          icon="🏷️"
          label="Kat."
          isActive={currentPage === "categories"}
          onClick={() => onNavigate("categories")}
        />
        <NavItem
          icon="📋"
          label="Ro'y"
          isActive={currentPage === "transactions"}
          onClick={() => onNavigate("transactions")}
        />
      </div>
    </nav>
  )
}

interface NavItemProps {
  icon: string
  label: string
  isActive: boolean
  onClick: () => void
}

function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-colors text-xs ${
        isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium text-[10px]">{label}</span>
    </button>
  )
}
