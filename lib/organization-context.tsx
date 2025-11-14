"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth-context"
import { supabase } from "./supabase"

interface Organization {
  id: string
  name: string
  slug: string
  owner_id: string
  plan_type: string
  member_count?: number
  role?: string
  created_at: string
}

interface OrganizationContextType {
  organizations: Organization[]
  currentOrganization: Organization | null
  setCurrentOrganization: (org: Organization | null) => void
  loading: boolean
  refreshOrganizations: () => Promise<void>
}

const OrganizationContext = createContext<OrganizationContextType>({
  organizations: [],
  currentOrganization: null,
  setCurrentOrganization: () => {},
  loading: true,
  refreshOrganizations: async () => {},
})

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchOrganizations = async () => {
    if (!user) {
      setOrganizations([])
      setCurrentOrganization(null)
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/organizations')
      const data = await response.json()

      if (data.organizations) {
        setOrganizations(data.organizations)

        // Set current organization to first one if not already set
        if (!currentOrganization && data.organizations.length > 0) {
          // Prefer personal workspace or first organization
          const personal = data.organizations.find((org: Organization) =>
            org.slug.startsWith('personal-')
          )
          setCurrentOrganization(personal || data.organizations[0])
        }
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrganizations()
  }, [user])

  // Store current organization in localStorage
  useEffect(() => {
    if (currentOrganization) {
      localStorage.setItem('currentOrganizationId', currentOrganization.id)
    }
  }, [currentOrganization])

  // Restore current organization from localStorage on mount
  useEffect(() => {
    const savedOrgId = localStorage.getItem('currentOrganizationId')
    if (savedOrgId && organizations.length > 0) {
      const savedOrg = organizations.find(org => org.id === savedOrgId)
      if (savedOrg) {
        setCurrentOrganization(savedOrg)
      }
    }
  }, [organizations])

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        currentOrganization,
        setCurrentOrganization,
        loading,
        refreshOrganizations: fetchOrganizations,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (!context) {
    throw new Error('useOrganization must be used within OrganizationProvider')
  }
  return context
}
