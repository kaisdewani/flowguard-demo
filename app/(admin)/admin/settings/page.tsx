"use client"

import { useState } from "react"
import { useAuth } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Loader2, User, Bell, TriangleAlert } from "lucide-react"
import { toast } from "sonner"

const DELETE_CONFIRM_WORD = "DELETE"

export default function SettingsPage() {
  const { user } = useAuth()

  // Profile state
  const [name, setName] = useState(user?.name ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [profileLoading, setProfileLoading] = useState(false)

  // Notifications state
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [orderAlerts, setOrderAlerts] = useState(true)
  const [marketing, setMarketing] = useState(false)

  // Danger zone state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required.")
      return
    }
    setProfileLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success("Profile changes saved successfully.")
    } finally {
      setProfileLoading(false)
    }
  }

  function handleDeleteAccount() {
    toast.success("Account deletion request submitted.")
    setDeleteDialogOpen(false)
    setDeleteConfirmText("")
  }

  const deleteEnabled = deleteConfirmText === DELETE_CONFIRM_WORD

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account preferences and profile information.
        </p>
      </div>

      {/* Profile section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">Profile</CardTitle>
          </div>
          <CardDescription>
            Update your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="pt-1">
              <Button type="submit" disabled={profileLoading}>
                {profileLoading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Notification preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">Notification Preferences</CardTitle>
          </div>
          <CardDescription>
            Choose which notifications you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox
                checked={emailNotifs}
                onCheckedChange={(checked) =>
                  setEmailNotifs(checked === true)
                }
                className="mt-0.5"
              />
              <div>
                <p className="text-sm font-medium group-hover:text-foreground transition-colors">
                  Email Notifications
                </p>
                <p className="text-xs text-muted-foreground">
                  Receive general email notifications about your account.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox
                checked={orderAlerts}
                onCheckedChange={(checked) =>
                  setOrderAlerts(checked === true)
                }
                className="mt-0.5"
              />
              <div>
                <p className="text-sm font-medium group-hover:text-foreground transition-colors">
                  Order Alerts
                </p>
                <p className="text-xs text-muted-foreground">
                  Get notified when new orders are placed or statuses change.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox
                checked={marketing}
                onCheckedChange={(checked) =>
                  setMarketing(checked === true)
                }
                className="mt-0.5"
              />
              <div>
                <p className="text-sm font-medium group-hover:text-foreground transition-colors">
                  Marketing Emails
                </p>
                <p className="text-xs text-muted-foreground">
                  Receive updates about new features and promotional offers.
                </p>
              </div>
            </label>

            <div className="pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => toast.success("Notification preferences saved.")}
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Danger Zone */}
      <Card className="border-destructive/50 ring-destructive/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TriangleAlert className="size-4 text-destructive" />
            <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Irreversible and destructive actions. Proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permanently delete your account and all associated data. This
                cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              className="shrink-0"
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete account confirmation dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) setDeleteConfirmText("")
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent and cannot be reversed. All your data,
              products, and order history will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col gap-1.5 py-1">
            <Label htmlFor="delete-confirm" className="text-sm">
              Type{" "}
              <span className="font-mono font-semibold text-destructive">
                {DELETE_CONFIRM_WORD}
              </span>{" "}
              to confirm
            </Label>
            <Input
              id="delete-confirm"
              placeholder={DELETE_CONFIRM_WORD}
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              autoComplete="off"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={!deleteEnabled}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
