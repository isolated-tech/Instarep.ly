"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Profile, ProfileContextType } from "@/types/profile"

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

const DEFAULT_PROFILE: Profile = {
  id: "default",
  name: "Default Profile",
  includeEmojis: true,
  tone: "friendly",
  language: "en",
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([DEFAULT_PROFILE])
  const [currentProfile, setCurrentProfileState] = useState<Profile | null>(DEFAULT_PROFILE)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load profiles from localStorage on mount
  useEffect(() => {
    const storedProfiles = localStorage.getItem("profiles")
    const storedCurrentProfileId = localStorage.getItem("currentProfileId")

    if (storedProfiles) {
      try {
        const parsedProfiles = JSON.parse(storedProfiles)
        setProfiles(parsedProfiles)

        if (storedCurrentProfileId) {
          const current = parsedProfiles.find((p: Profile) => p.id === storedCurrentProfileId)
          if (current) {
            setCurrentProfileState(current)
          }
        }
      } catch (error) {
        console.error("Failed to parse stored profiles:", error)
      }
    }
    setIsInitialized(true)
  }, [])

  // Save profiles to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("profiles", JSON.stringify(profiles))
    }
  }, [profiles, isInitialized])

  // Save current profile ID to localStorage
  useEffect(() => {
    if (isInitialized && currentProfile) {
      localStorage.setItem("currentProfileId", currentProfile.id)
    }
  }, [currentProfile, isInitialized])

  const setCurrentProfile = (profile: Profile) => {
    setCurrentProfileState(profile)
  }

  const updateProfile = (id: string, updates: Partial<Profile>) => {
    setProfiles((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      // Update current profile if it's the one being updated
      if (currentProfile?.id === id) {
        setCurrentProfileState({ ...currentProfile, ...updates })
      }
      return updated
    })
  }

  const createProfile = (profile: Omit<Profile, "id">) => {
    const newProfile: Profile = {
      ...profile,
      id: `profile-${Date.now()}`,
    }
    setProfiles((prev) => [...prev, newProfile])
  }

  const deleteProfile = (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id))
    // If deleting current profile, switch to default
    if (currentProfile?.id === id) {
      setCurrentProfileState(profiles[0] || DEFAULT_PROFILE)
    }
  }

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        currentProfile,
        setCurrentProfile,
        updateProfile,
        createProfile,
        deleteProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}
