import { create } from 'zustand'
import { FilesDataType } from '../types/filesType'

/**
 * Current Store for storage data about the currently selected folder
 */
type FolderStore = {
	folderData: FilesDataType | undefined
	setFolderData: (folder: FilesDataType | undefined) => void
}

export const useFolderStore = create<FolderStore>((set) => ({
	folderData: undefined,
	setFolderData: (folderData) => set({ folderData }),
}))
