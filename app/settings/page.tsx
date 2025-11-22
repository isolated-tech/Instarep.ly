"use client"

import { useProfile } from "@/contexts/ProfileContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const { currentProfile, updateProfile } = useProfile()

  if (!currentProfile) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/demo">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-muted-foreground">Customize your AI response preferences</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Configure how the AI responds to your messages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Profile Name</Label>
              <Input
                id="profile-name"
                value={currentProfile.name}
                onChange={(e) => updateProfile(currentProfile.id, { name: e.target.value })}
                placeholder="Enter profile name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Response Tone</Label>
              <Select
                value={currentProfile.tone || "friendly"}
                onValueChange={(value) => updateProfile(currentProfile.id, { tone: value })}
              >
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select a tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="include-emojis" className="text-base font-medium">
                  Include Emojis
                </Label>
                <p className="text-sm text-muted-foreground">
                  Add emojis to make responses more expressive and engaging
                </p>
              </div>
              <Switch
                id="include-emojis"
                checked={currentProfile.includeEmojis}
                onCheckedChange={(checked) => updateProfile(currentProfile.id, { includeEmojis: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Settings</CardTitle>
            <CardDescription>Review your active profile configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Profile ID:</dt>
                <dd className="font-mono">{currentProfile.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Profile Name:</dt>
                <dd className="font-medium">{currentProfile.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tone:</dt>
                <dd className="font-medium capitalize">{currentProfile.tone || "friendly"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Include Emojis:</dt>
                <dd className="font-medium">{currentProfile.includeEmojis ? "Yes" : "No"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
