"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Mail, Plus, Trash2, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface EmailInvitationModalProps {
  feedbackRequestId: string
  requestTitle: string
  onClose: () => void
}

interface Recipient {
  email: string
  name: string
}

export default function EmailInvitationModal({
  feedbackRequestId,
  requestTitle,
  onClose,
}: EmailInvitationModalProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([{ email: '', name: '' }])
  const [sending, setSending] = useState(false)
  const [bulkEmails, setBulkEmails] = useState('')
  const [showBulkInput, setShowBulkInput] = useState(false)
  const [sentCount, setSentCount] = useState<number | null>(null)
  const [failedCount, setFailedCount] = useState<number | null>(null)

  const addRecipient = () => {
    setRecipients([...recipients, { email: '', name: '' }])
  }

  const removeRecipient = (index: number) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index))
    }
  }

  const updateRecipient = (index: number, field: 'email' | 'name', value: string) => {
    const updated = [...recipients]
    updated[index][field] = value
    setRecipients(updated)
  }

  const parseBulkEmails = () => {
    // Parse emails from bulk input (comma or newline separated)
    const emails = bulkEmails
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0)

    const newRecipients: Recipient[] = emails.map(email => ({
      email,
      name: email.split('@')[0] // Use email prefix as default name
    }))

    setRecipients(newRecipients)
    setBulkEmails('')
    setShowBulkInput(false)
    toast.success(`Added ${newRecipients.length} recipients`)
  }

  const handleSend = async () => {
    // Validate
    const validRecipients = recipients.filter(r => r.email.trim() && r.email.includes('@'))

    if (validRecipients.length === 0) {
      toast.error('Please add at least one valid email address')
      return
    }

    setSending(true)

    try {
      const response = await fetch('/api/send-invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbackRequestId,
          recipients: validRecipients,
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSentCount(data.sent)
        setFailedCount(data.failed || 0)
        // Don't close immediately - show success message
      } else {
        toast.error(data.error || 'Failed to send invitations')
      }
    } catch (error) {
      console.error('Send error:', error)
      toast.error('Failed to send invitations')
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <Card
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Mail className="h-6 w-6 text-indigo-600" />
                Send Invitations
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Invite people to provide feedback for: <strong>{requestTitle}</strong>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Success Message */}
          {sentCount !== null && (
            <div className={`${failedCount && failedCount > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'} border-2 rounded-xl p-4 mb-6`}>
              <div className="flex items-start gap-3">
                <Mail className={`h-6 w-6 ${failedCount && failedCount > 0 ? 'text-yellow-600' : 'text-green-600'} flex-shrink-0 mt-0.5`} />
                <div className="flex-1">
                  <p className={`font-bold ${failedCount && failedCount > 0 ? 'text-yellow-900' : 'text-green-900'} text-base`}>
                    {failedCount && failedCount > 0 ? '⚠️ ' : '✅ '}Invitations {failedCount && failedCount > 0 ? 'Partially ' : ''}Sent!
                  </p>
                  <p className={`text-sm ${failedCount && failedCount > 0 ? 'text-yellow-700' : 'text-green-700'} mt-1`}>
                    Successfully sent <strong>{sentCount} invitation{sentCount !== 1 ? 's' : ''}</strong>
                  </p>
                  {failedCount !== null && failedCount > 0 && (
                    <p className="text-sm text-yellow-700 mt-1">
                      ⚠️ <strong>{failedCount} email{failedCount !== 1 ? 's' : ''}</strong> failed to send
                    </p>
                  )}
                  <button
                    onClick={onClose}
                    className={`text-xs ${failedCount && failedCount > 0 ? 'text-yellow-700' : 'text-green-700'} underline hover:no-underline font-semibold mt-3 inline-block`}
                  >
                    Close and return to results →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Input Toggle */}
          <div className="mb-4">
            <Button
              onClick={() => setShowBulkInput(!showBulkInput)}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {showBulkInput ? 'Individual Entry' : 'Bulk Entry (CSV)'}
            </Button>
          </div>

          {/* Bulk Input */}
          {showBulkInput && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste emails (comma or newline separated)
              </label>
              <textarea
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                placeholder="john@example.com, jane@example.com&#10;bob@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[100px]"
              />
              <Button
                onClick={parseBulkEmails}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Parse Emails
              </Button>
            </div>
          )}

          {/* Individual Recipients */}
          {!showBulkInput && (
            <div className="space-y-3 mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Recipients
              </label>
              {recipients.map((recipient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="email"
                    value={recipient.email}
                    onChange={(e) => updateRecipient(index, 'email', e.target.value)}
                    placeholder="email@example.com"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={recipient.name}
                    onChange={(e) => updateRecipient(index, 'name', e.target.value)}
                    placeholder="Name (optional)"
                    className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  {recipients.length > 1 && (
                    <button
                      onClick={() => removeRecipient(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={addRecipient}
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <Plus className="h-4 w-4" />
                Add Another Recipient
              </button>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              <strong>📧 What will they receive?</strong><br />
              A professional email invitation with:
            </p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1 ml-4">
              <li>• Direct link to the feedback form</li>
              <li>• Clear explanation that it's 100% anonymous</li>
              <li>• Your name and the request title</li>
              <li>• Estimated time to complete (~3 minutes)</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleSend}
              disabled={sending}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send {recipients.filter(r => r.email.trim()).length} Invitation{recipients.filter(r => r.email.trim()).length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              disabled={sending}
            >
              Cancel
            </Button>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            Emails will be sent from feedback@voiceclara.com
          </p>
        </div>
      </Card>
    </div>
  )
}
