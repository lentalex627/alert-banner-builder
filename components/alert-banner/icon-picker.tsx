"use client"

import * as React from "react"
import {
  mdiInformationOutline,
  mdiAlertOutline,
  mdiAlertCircleOutline,
  mdiCheckCircleOutline,
  mdiBellOutline,
  mdiBullhornOutline,
  mdiClockOutline,
  mdiLightningBoltOutline,
  mdiStarOutline,
  mdiGiftOutline,
  mdiTagOutline,
  mdiFire,
} from "@mdi/js"
import { Icon } from "@/lib/icon"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Map icon names to MDI paths
const iconMap: Record<string, string> = {
  "information-outline": mdiInformationOutline,
  "alert-outline": mdiAlertOutline,
  "alert-circle-outline": mdiAlertCircleOutline,
  "check-circle-outline": mdiCheckCircleOutline,
  "bell-outline": mdiBellOutline,
  "bullhorn-outline": mdiBullhornOutline,
  "clock-outline": mdiClockOutline,
  "lightning-bolt-outline": mdiLightningBoltOutline,
  "star-outline": mdiStarOutline,
  "gift-outline": mdiGiftOutline,
  "tag-outline": mdiTagOutline,
  "fire": mdiFire,
}

const iconLabels: Record<string, string> = {
  "information-outline": "Info",
  "alert-outline": "Warning",
  "alert-circle-outline": "Error",
  "check-circle-outline": "Success",
  "bell-outline": "Bell",
  "bullhorn-outline": "Announcement",
  "clock-outline": "Clock",
  "lightning-bolt-outline": "Lightning",
  "star-outline": "Star",
  "gift-outline": "Gift",
  "tag-outline": "Tag",
  "fire": "Fire",
}

interface IconPickerProps {
  value: string
  onChange: (icon: string) => void
  label?: string
}

export function IconPicker({ value, onChange, label }: IconPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const selectedPath = iconMap[value] || iconMap["information-outline"]

  return (
    <div className="space-y-2">
      {label && <Label className="text-xs text-muted-foreground">{label}</Label>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-10"
          >
            <Icon path={selectedPath} className="h-5 w-5" />
            <span className="text-sm">{iconLabels[value] || "Select Icon"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <div className="space-y-2">
            <Label className="text-xs">Select an Icon</Label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(iconMap).map(([name, path]) => (
                <button
                  key={name}
                  type="button"
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-all hover:bg-accent",
                    value === name
                      ? "bg-primary/10 ring-2 ring-primary"
                      : "hover:bg-accent"
                  )}
                  onClick={() => {
                    onChange(name)
                    setIsOpen(false)
                  }}
                  title={iconLabels[name]}
                >
                  <Icon path={path} className="h-5 w-5" />
                  <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                    {iconLabels[name]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// Export the icon map for use in preview
export { iconMap }

