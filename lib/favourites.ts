// Key used for storing favourites in localStorage
const FAV_KEY = 'favourites'

// Type representing a single favourite entry with a vehicle ID and timestamp
type FavouriteEntry = {
  vehicleId: number
  addedAt: number // Timestamp in milliseconds when the vehicle was added
}

// Define how long a favourite entry should last before expiring (30 days in ms)
const EXPIRY_DAYS = 30
const EXPIRY_MS = EXPIRY_DAYS * 24 * 60 * 60 * 1000 // Convert days to milliseconds

/**
 * Retrieves the current list of favourite vehicle IDs from localStorage.
 * Filters out expired entries (older than 30 days).
 * Returns a list of valid vehicle IDs.
 */
function getFavourites(): number[] {
  // Guard clause for environments without `window` (e.g., server-side rendering)
  if (typeof window === 'undefined') return []

  const raw = localStorage.getItem(FAV_KEY)
  if (!raw) return []

  // Parse stored data into array of FavouriteEntry
  const items: FavouriteEntry[] = JSON.parse(raw)
  const now = Date.now()

  // Keep only entries that are within the valid (non-expired) time window
  const validItems = items.filter((entry) => now - entry.addedAt < EXPIRY_MS)

  // Update localStorage with cleaned (non-expired) list
  localStorage.setItem(FAV_KEY, JSON.stringify(validItems))

  // Return array of valid vehicle IDs only
  return validItems.map((entry) => entry.vehicleId)
}

/**
 * Toggles the presence of a vehicle ID in the favourites list.
 * - If already a favourite: removes it.
 * - If not a favourite: adds it with current timestamp.
 * Returns `true` if added, `false` if removed.
 */
function toggleFavourite(vehicleId: number): boolean {
  // Guard clause for environments without `window` (e.g., SSR)
  if (typeof window === 'undefined') return false

  // Get current list of valid favourite vehicle IDs
  const favourites = getFavourites()
  const exists = favourites.includes(vehicleId)
  let updated: FavouriteEntry[]

  if (exists) {
    // Remove the vehicle from favourites
    updated = favourites
      .filter((id) => id !== vehicleId)
      .map((id) => ({
        vehicleId: id,
        addedAt: Date.now(), // Update timestamp to keep other entries fresh
      }))
  } else {
    // Add new favourite along with existing ones
    updated = [
      ...favourites.map((id) => ({
        vehicleId: id,
        addedAt: Date.now(), // Refresh timestamps for all
      })),
      { vehicleId, addedAt: Date.now() }, // New entry
    ]
  }

  // Save updated list back to localStorage
  localStorage.setItem(FAV_KEY, JSON.stringify(updated))

  // Return true if added, false if removed
  return !exists
}

// Export the utility functions
export { getFavourites, toggleFavourite }
