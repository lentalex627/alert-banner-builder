"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ColorPicker } from "./color-picker"
import { IconPicker } from "./icon-picker"
import {
  AlertBannerConfig,
  AlertType,
  AlertPosition,
  AnimationType,
  DisplayOption,
  ButtonStyle,
  alertTypePresets,
} from "@/types/alert-banner"
import { ChevronDown, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfigurationPanelProps {
  config: AlertBannerConfig
  onChange: (config: AlertBannerConfig) => void
  errors: Record<string, string>
}

export function ConfigurationPanel({ config, onChange, errors }: ConfigurationPanelProps) {
  const [ctaOpen, setCtaOpen] = React.useState(!!config.cta)

  const updateConfig = <K extends keyof AlertBannerConfig>(
    key: K,
    value: AlertBannerConfig[K]
  ) => {
    onChange({ ...config, [key]: value })
  }

  const updateCTA = <K extends keyof NonNullable<AlertBannerConfig['cta']>>(
    key: K,
    value: NonNullable<AlertBannerConfig['cta']>[K]
  ) => {
    onChange({
      ...config,
      cta: {
        text: config.cta?.text || '',
        url: config.cta?.url || '',
        style: config.cta?.style || 'primary',
        [key]: value,
      },
    })
  }

  const handleTypeChange = (type: AlertType) => {
    const preset = alertTypePresets[type]
    onChange({
      ...config,
      type,
      backgroundColor: preset.bg,
      textColor: preset.text,
      icon: preset.icon,
    })
  }

  const removeCTA = () => {
    const { cta: _cta, ...rest } = config
    onChange(rest as AlertBannerConfig)
    setCtaOpen(false)
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Alert Configuration
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure your alert banner appearance and behavior
          </p>
        </div>

        {/* Message Section */}
        <div className="space-y-3">
          <Label htmlFor="message" className="text-sm font-medium">
            Alert Message <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="message"
            value={config.message}
            onChange={(e) => updateConfig("message", e.target.value)}
            placeholder="Enter your alert message here..."
            className={cn(
              "min-h-[100px]",
              errors.message && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {errors.message && (
            <p className="text-xs text-destructive">{errors.message}</p>
          )}
        </div>

        {/* Alert Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Alert Type</Label>
          <Tabs value={config.type} onValueChange={(v) => handleTypeChange(v as AlertType)}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="info" className="text-xs">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5" />
                Info
              </TabsTrigger>
              <TabsTrigger value="success" className="text-xs">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
                Success
              </TabsTrigger>
              <TabsTrigger value="warning" className="text-xs">
                <span className="w-2 h-2 rounded-full bg-orange-500 mr-1.5" />
                Warning
              </TabsTrigger>
              <TabsTrigger value="error" className="text-xs">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5" />
                Error
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Display Options */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Display Behavior</Label>
          <Select
            value={config.displayOption}
            onValueChange={(v) => {
              updateConfig("displayOption", v as DisplayOption)
              updateConfig("dismissible", v === "dismissible")
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select display option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dismissible">
                <div className="flex flex-col">
                  <span>Dismissible</span>
                  <span className="text-xs text-muted-foreground">User can close the alert</span>
                </div>
              </SelectItem>
              <SelectItem value="persistent">
                <div className="flex flex-col">
                  <span>Persistent</span>
                  <span className="text-xs text-muted-foreground">Always visible, cannot be closed</span>
                </div>
              </SelectItem>
              <SelectItem value="timed">
                <div className="flex flex-col">
                  <span>Timed</span>
                  <span className="text-xs text-muted-foreground">Auto-dismiss after duration</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {config.displayOption === "timed" && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={60}
                value={config.timedDuration || 5}
                onChange={(e) => updateConfig("timedDuration", parseInt(e.target.value) || 5)}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">seconds</span>
            </div>
          )}
        </div>

        {/* Position */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Position</Label>
          <Select
            value={config.position}
            onValueChange={(v) => updateConfig("position", v as AlertPosition)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top of page</SelectItem>
              <SelectItem value="bottom">Bottom of page</SelectItem>
              <SelectItem value="fixed">Fixed (sticky)</SelectItem>
              <SelectItem value="inline">Inline (in content)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Animation */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Animation</Label>
          <Select
            value={config.animation}
            onValueChange={(v) => updateConfig("animation", v as AnimationType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select animation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="slide-down">Slide Down</SelectItem>
              <SelectItem value="slide-up">Slide Up</SelectItem>
              <SelectItem value="fade-in">Fade In</SelectItem>
              <SelectItem value="bounce">Bounce</SelectItem>
              <SelectItem value="shake">Shake</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Icon Selection */}
        <IconPicker
          value={config.icon}
          onChange={(icon) => updateConfig("icon", icon)}
          label="Icon"
        />

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker
            value={config.backgroundColor}
            onChange={(color) => updateConfig("backgroundColor", color)}
            label="Background Color"
          />
          <ColorPicker
            value={config.textColor}
            onChange={(color) => updateConfig("textColor", color)}
            label="Text Color"
          />
        </div>

        {/* CTA Section */}
        <Collapsible open={ctaOpen} onOpenChange={setCtaOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                Call-to-Action Button
                {config.cta && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Enabled
                  </span>
                )}
              </span>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                ctaOpen && "rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div className="space-y-3">
              <Label htmlFor="cta-text" className="text-sm">Button Text</Label>
              <Input
                id="cta-text"
                value={config.cta?.text || ''}
                onChange={(e) => updateCTA("text", e.target.value)}
                placeholder="Learn More"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="cta-url" className="text-sm">Button URL</Label>
              <Input
                id="cta-url"
                value={config.cta?.url || ''}
                onChange={(e) => updateCTA("url", e.target.value)}
                placeholder="/more-info or https://..."
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm">Button Style</Label>
              <Select
                value={config.cta?.style || 'primary'}
                onValueChange={(v) => updateCTA("style", v as ButtonStyle)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary (Filled)</SelectItem>
                  <SelectItem value="secondary">Secondary (Outline)</SelectItem>
                  <SelectItem value="text">Text (Link style)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {config.cta && (
              <Button
                variant="ghost"
                colorScheme="danger"
                size="sm"
                onClick={removeCTA}
                className="w-full"
              >
                Remove CTA Button
              </Button>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}

