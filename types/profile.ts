export interface Profile {
  id: string
  name: string
  includeEmojis: boolean
  tone?: string
  language?: string
}

export interface ProfileContextType {
  profiles: Profile[]
  currentProfile: Profile | null
  setCurrentProfile: (profile: Profile) => void
  updateProfile: (id: string, updates: Partial<Profile>) => void
  createProfile: (profile: Omit<Profile, "id">) => void
  deleteProfile: (id: string) => void
}
