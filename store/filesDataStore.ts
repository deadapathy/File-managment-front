import { create } from 'zustand'
import { FilesDataType } from '../types/filesType'

type FileStore = {
	files: FilesDataType[] | []
	folders: FilesDataType[] | []
	setFiles: (files: FilesDataType[]) => void
	setFolders: (folders: FilesDataType[]) => void
}

export const useFileStore = create<FileStore>((set) => ({
	files: [],
	folders: [],
	setFiles: (files) => set({ files }),
	setFolders: (folders) => set({ folders }),
}))
