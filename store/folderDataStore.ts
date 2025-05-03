import { create } from 'zustand'
import { FilesDataType } from '../types/filesType'

type FolderStore = {
	folderData: FilesDataType | undefined
	setFolderData: (folder: FilesDataType | undefined) => void
}

export const useFolderStore = create<FolderStore>((set) => ({
	folderData: undefined,
	setFolderData: (folderData) => set({ folderData }),
}))
