"use client"

import * as React from "react"
import { AlertBannerConfig } from "@/types/alert-banner"
import { Icon } from "@/lib/icon"
import { iconMap } from "./icon-picker"
import { X, RefreshCw, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertPreviewProps {
  config: AlertBannerConfig
}

export function AlertPreview({ config }: AlertPreviewProps) {
  const [isVisible, setIsVisible] = React.useState(true)
  const [animationKey, setAnimationKey] = React.useState(0)

  // Reset visibility when config changes
  React.useEffect(() => {
    setIsVisible(true)
  }, [config])

  const handleDismiss = () => {
    setIsVisible(false)
  }

  const handleReplay = () => {
    setIsVisible(false)
    setAnimationKey((k) => k + 1)
    setTimeout(() => setIsVisible(true), 100)
  }

  const getAnimationClass = () => {
    if (!isVisible) return "opacity-0 translate-y-[-20px]"
    
    switch (config.animation) {
      case "slide-down":
        return "animate-slide-down"
      case "slide-up":
        return "animate-slide-up"
      case "fade-in":
        return "animate-fade-in"
      case "bounce":
        return "animate-bounce-in"
      case "shake":
        return "animate-shake"
      default:
        return ""
    }
  }

  const getPositionClass = () => {
    switch (config.position) {
      case "top":
        return "rounded-lg"
      case "bottom":
        return "rounded-lg"
      case "fixed":
        return "rounded-none shadow-lg"
      case "inline":
        return "rounded-lg"
      default:
        return "rounded-lg"
    }
  }

  const getButtonStyles = () => {
    const baseStyles = "px-4 py-1.5 text-sm font-medium rounded-full transition-all"
    
    switch (config.cta?.style) {
      case "primary":
        return cn(baseStyles, "bg-white/20 hover:bg-white/30 backdrop-blur-sm")
      case "secondary":
        return cn(baseStyles, "border-2 border-current hover:bg-white/10")
      case "text":
        return cn(baseStyles, "underline underline-offset-2 hover:no-underline px-2")
      default:
        return cn(baseStyles, "bg-white/20 hover:bg-white/30")
    }
  }

  const iconPath = iconMap[config.icon] || iconMap["information-outline"]

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Live Preview</span>
          <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
            {config.position}
          </span>
        </div>
        <button
          onClick={handleReplay}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Replay Animation
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 overflow-hidden">
        {/* Mock Browser Frame */}
        <div className="bg-white dark:bg-gray-950 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 h-full flex flex-col">
          {/* Browser Chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-white dark:bg-gray-700 rounded-md px-3 py-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span className="truncate">https://your-website.com</span>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 relative overflow-hidden">
            {/* Alert Banner */}
            {config.position === "top" && (
              <div className="p-3">
                {isVisible && (
                  <div
                    key={animationKey}
                    className={cn(
                      "transition-all duration-300",
                      getAnimationClass(),
                      getPositionClass()
                    )}
                    style={{
                      backgroundColor: config.backgroundColor,
                      color: config.textColor,
                    }}
                  >
                    <div className="flex items-center gap-3 px-4 py-3">
                      <Icon path={iconPath} className="h-5 w-5 shrink-0" />
                      <p className="flex-1 text-sm font-medium">
                        {config.message || "Your alert message will appear here..."}
                      </p>
                      {config.cta && config.cta.text && (
                        <a
                          href={config.cta.url || "#"}
                          className={getButtonStyles()}
                          onClick={(e) => e.preventDefault()}
                        >
                          {config.cta.text}
                          {config.cta.style === "text" && (
                            <ExternalLink className="inline-block ml-1 h-3 w-3" />
                          )}
                        </a>
                      )}
                      {config.dismissible && (
                        <button
                          onClick={handleDismiss}
                          className="p-1 hover:bg-black/10 rounded-full transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mock Page Content */}
            <div className="p-6 space-y-4">
              {config.position === "inline" && isVisible && (
                <div
                  key={animationKey}
                  className={cn(
                    "transition-all duration-300 mb-4",
                    getAnimationClass(),
                    getPositionClass()
                  )}
                  style={{
                    backgroundColor: config.backgroundColor,
                    color: config.textColor,
                  }}
                >
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Icon path={iconPath} className="h-5 w-5 shrink-0" />
                    <p className="flex-1 text-sm font-medium">
                      {config.message || "Your alert message will appear here..."}
                    </p>
                    {config.cta && config.cta.text && (
                      <a
                        href={config.cta.url || "#"}
                        className={getButtonStyles()}
                        onClick={(e) => e.preventDefault()}
                      >
                        {config.cta.text}
                      </a>
                    )}
                    {config.dismissible && (
                      <button
                        onClick={handleDismiss}
                        className="p-1 hover:bg-black/10 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Placeholder Content */}
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-5/6" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-4/6" />
              </div>
              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg" />
              </div>
            </div>

            {/* Fixed/Bottom Position Alert */}
            {(config.position === "fixed" || config.position === "bottom") && isVisible && (
              <div
                className={cn(
                  "absolute left-0 right-0",
                  config.position === "fixed" ? "bottom-0" : "bottom-3 mx-3"
                )}
              >
                <div
                  key={animationKey}
                  className={cn(
                    "transition-all duration-300",
                    getAnimationClass(),
                    getPositionClass()
                  )}
                  style={{
                    backgroundColor: config.backgroundColor,
                    color: config.textColor,
                  }}
                >
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Icon path={iconPath} className="h-5 w-5 shrink-0" />
                    <p className="flex-1 text-sm font-medium">
                      {config.message || "Your alert message will appear here..."}
                    </p>
                    {config.cta && config.cta.text && (
                      <a
                        href={config.cta.url || "#"}
                        className={getButtonStyles()}
                        onClick={(e) => e.preventDefault()}
                      >
                        {config.cta.text}
                      </a>
                    )}
                    {config.dismissible && (
                      <button
                        onClick={handleDismiss}
                        className="p-1 hover:bg-black/10 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* JSON Output Preview */}
      <div className="border-t">
        <details className="group">
          <summary className="px-4 py-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground flex items-center gap-2">
            <ChevronIcon className="h-3.5 w-3.5 transition-transform group-open:rotate-90" />
            View JSON Output
          </summary>
          <div className="px-4 pb-3">
            <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto max-h-32">
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

