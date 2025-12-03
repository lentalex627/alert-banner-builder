"use client"

import * as React from "react"
import { useMarketplaceClient } from "@/components/providers/marketplace"
import { ConfigurationPanel } from "./configuration-panel"
import { AlertPreview } from "./alert-preview"
import { AlertBannerConfig, defaultAlertConfig } from "@/types/alert-banner"
import { Button } from "@/components/ui/button"
import { Save, RotateCcw, AlertCircle, CheckCircle2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SaveStatus {
  type: "idle" | "saving" | "success" | "error"
  message?: string
}

export function AlertBannerBuilder() {
  const client = useMarketplaceClient()
  const [config, setConfig] = React.useState<AlertBannerConfig>(defaultAlertConfig)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [saveStatus, setSaveStatus] = React.useState<SaveStatus>({ type: "idle" })
  const [hasChanges, setHasChanges] = React.useState(false)
  const [initialConfig, setInitialConfig] = React.useState<AlertBannerConfig | null>(null)

  // Load initial value from Sitecore field
  React.useEffect(() => {
    const loadValue = async () => {
      try {
        const value = await client.getValue()
        if (value) {
          let parsed: AlertBannerConfig
          if (typeof value === "string") {
            parsed = JSON.parse(value)
          } else {
            parsed = value as AlertBannerConfig
          }
          // Merge with defaults to ensure all fields exist
          const mergedConfig = { ...defaultAlertConfig, ...parsed }
          setConfig(mergedConfig)
          setInitialConfig(mergedConfig)
        } else {
          setInitialConfig(defaultAlertConfig)
        }
      } catch (error) {
        console.error("Error loading field value:", error)
        setInitialConfig(defaultAlertConfig)
      }
    }
    loadValue()
  }, [client])

  // Track changes
  React.useEffect(() => {
    if (initialConfig) {
      const hasChanged = JSON.stringify(config) !== JSON.stringify(initialConfig)
      setHasChanges(hasChanged)
    }
  }, [config, initialConfig])

  // Validate configuration
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!config.message.trim()) {
      newErrors.message = "Alert message is required"
    }

    if (config.cta) {
      if (config.cta.text && !config.cta.url) {
        newErrors.ctaUrl = "URL is required when button text is provided"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Save to Sitecore field
  const handleSave = async () => {
    if (!validate()) {
      setSaveStatus({ type: "error", message: "Please fix the errors before saving" })
      return
    }

    setSaveStatus({ type: "saving" })

    try {
      // Clean up config before saving (remove empty CTA)
      const configToSave = { ...config }
      if (configToSave.cta && !configToSave.cta.text && !configToSave.cta.url) {
        delete configToSave.cta
      }

      const jsonValue = JSON.stringify(configToSave)
      await client.setValue(jsonValue, true)
      
      setInitialConfig(configToSave)
      setHasChanges(false)
      setSaveStatus({ type: "success", message: "Alert configuration saved!" })
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus({ type: "idle" })
      }, 3000)
    } catch (error) {
      console.error("Error saving field value:", error)
      setSaveStatus({ 
        type: "error", 
        message: error instanceof Error ? error.message : "Failed to save configuration" 
      })
    }
  }

  // Reset to initial value
  const handleReset = () => {
    if (initialConfig) {
      setConfig(initialConfig)
      setErrors({})
      setSaveStatus({ type: "idle" })
    }
  }

  // Clear the alert completely
  const handleClear = async () => {
    setSaveStatus({ type: "saving" })

    try {
      // Set empty string to clear the field
      await client.setValue("", true)
      
      // Reset to default config
      setConfig(defaultAlertConfig)
      setInitialConfig(defaultAlertConfig)
      setHasChanges(false)
      setErrors({})
      setSaveStatus({ type: "success", message: "Alert cleared!" })
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus({ type: "idle" })
      }, 3000)
    } catch (error) {
      console.error("Error clearing field value:", error)
      setSaveStatus({ 
        type: "error", 
        message: error instanceof Error ? error.message : "Failed to clear alert" 
      })
    }
  }

  // Handle config changes
  const handleConfigChange = (newConfig: AlertBannerConfig) => {
    setConfig(newConfig)
    // Clear errors for fields that are now valid
    if (newConfig.message.trim() && errors.message) {
      setErrors((prev) => {
        const { message: _message, ...rest } = prev
        return rest
      })
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold">Alert Banner Builder</h1>
            <p className="text-xs text-muted-foreground">
              Configure your alert banner
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Status Indicator */}
          {saveStatus.type !== "idle" && (
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                saveStatus.type === "saving" && "bg-muted text-muted-foreground",
                saveStatus.type === "success" && "bg-success-background text-success-foreground",
                saveStatus.type === "error" && "bg-destructive-background text-destructive-foreground"
              )}
            >
              {saveStatus.type === "saving" && (
                <>
                  <span className="animate-spin">⏳</span>
                  Saving...
                </>
              )}
              {saveStatus.type === "success" && (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {saveStatus.message}
                </>
              )}
              {saveStatus.type === "error" && (
                <>
                  <AlertCircle className="h-3.5 w-3.5" />
                  {saveStatus.message}
                </>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <Button
            variant="outline"
            colorScheme="danger"
            size="sm"
            onClick={handleClear}
            disabled={saveStatus.type === "saving"}
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Clear
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={!hasChanges || saveStatus.type === "saving"}
          >
            <RotateCcw className="h-4 w-4 mr-1.5" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || saveStatus.type === "saving"}
          >
            <Save className="h-4 w-4 mr-1.5" />
            Save
          </Button>
        </div>
      </header>

      {/* Main Content - Split Pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Configuration Panel - Left */}
        <div className="w-[400px] border-r bg-card overflow-hidden flex flex-col">
          <ConfigurationPanel
            config={config}
            onChange={handleConfigChange}
            errors={errors}
          />
        </div>

        {/* Preview Panel - Right */}
        <div className="flex-1 overflow-hidden">
          <AlertPreview config={config} />
        </div>
      </div>
    </div>
  )
}

