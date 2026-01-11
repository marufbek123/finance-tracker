interface StatCardProps {
  icon: string
  label: string
  amount: number
  color: "success" | "destructive"
}

export default function StatCard({ icon, label, amount, color }: StatCardProps) {
  const bgColor = color === "success" ? "bg-success/10" : "bg-destructive/10"
  const textColor = color === "success" ? "text-success" : "text-destructive"

  return (
    <div className={`card ${bgColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={`text-2xl font-bold ${textColor}`}>{amount.toLocaleString("uz-UZ")} so'm</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  )
}
