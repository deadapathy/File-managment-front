import { create } from 'zustand'

/**
 * Current store for spinner and status text
 */
type UploadState = {
	isUploading: boolean
	statusText: string
	setStatusText: (text: string) => void
	setUploading: (value: boolean) => void
}

export const useUploadStore = create<UploadState>((set) => ({
	isUploading: false,
	statusText: '',
	setStatusText: (text) => set({ statusText: text }),
	setUploading: (value) => set({ isUploading: value }),
}))
