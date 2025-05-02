import { UploadFile } from 'antd'
import { create } from 'zustand'

interface PreviewStoreState {
	images: UploadFile<any>[]
	imagesURL: string[]
	setImages: (files: UploadFile<any>[]) => void
	updateImages: (index: number) => void
	clearImages: () => void
}

const usePreviewStore = create<PreviewStoreState>((set) => ({
	images: [],
	imagesURL: [],
	setImages: (files: UploadFile<any>[]) => {
		const imagePreviews = files.map((file) => {
			if (file.originFileObj) {
				return URL.createObjectURL(file.originFileObj)
			}
			return file.url || ''
		})
		set({ imagesURL: imagePreviews, images: files })
	},
	updateImages: (index: number) => {
		set((state) => {
			const updatedFiles = state.images.filter((_, idx) => idx !== index)
			const updatedURLs = updatedFiles.map((file) => {
				if (file.originFileObj) {
					return URL.createObjectURL(file.originFileObj)
				}
				return file.url || ''
			})

			return {
				images: updatedFiles,
				imagesURL: updatedURLs,
			}
		})
	},
	clearImages: () => set({ images: [] }),
}))

export default usePreviewStore
