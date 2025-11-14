import { AlertCircle, CheckCircle2, Info, XCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertMessageProps {
  type: "success" | "error" | "warning" | "info"
  title?: string
  message: string
  onClose?: () => void
  className?: string
}

export function AlertMessage({
  type,
  title,
  message,
  onClose,
  className,
}: AlertMessageProps) {
  const config = {
    success: {
      icon: CheckCircle2,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      iconColor: "text-green-600",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-600",
    },
    warning: {
      icon: AlertCircle,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-800",
      iconColor: "text-amber-600",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      iconColor: "text-blue-600",
    },
  }

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type]

  return (
    <div
      className={cn(
        "rounded-lg border-2 p-4 mb-4",
        bgColor,
        borderColor,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", iconColor)} />
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={cn("font-semibold mb-1", textColor)}>{title}</h3>
          )}
          <p className={cn("text-sm", textColor)}>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              "flex-shrink-0 p-1 hover:bg-black/5 rounded transition-colors",
              textColor
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
