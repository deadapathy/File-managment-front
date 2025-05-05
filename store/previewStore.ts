import { UploadFile } from 'antd'
import { create } from 'zustand'

/**
 * Current Store for collect data about images and URL's
 */
type PreviewStoreState = {
	images: UploadFile<unknown>[]
	imagesURL: string[]
	setImages: (files: UploadFile<unknown>[]) => void
	updateImages: (index: number) => void
	clearImages: () => void
}

const usePreviewStore = create<PreviewStoreState>((set, get) => ({
	images: [],
	imagesURL: [],
	setImages: (files: UploadFile<unknown>[]) => {
		const imagePreviews = files.map((file) => {
			if (file.originFileObj) {
				return URL.createObjectURL(file.originFileObj)
			}
			return file.url || ''
		})
		set({ imagesURL: imagePreviews, images: files })
	},
	updateImages: (index: number) => {
		const state = get()

		const fileToRemove = state.images[index]
		if (fileToRemove?.originFileObj) {
			URL.revokeObjectURL(state.imagesURL[index])
		}

		const updatedFiles = state.images.filter((_, idx) => idx !== index)
		const updatedURLs = updatedFiles.map((file) => {
			if (file.originFileObj) {
				return URL.createObjectURL(file.originFileObj)
			}
			return file.url || ''
		})

		set({
			images: updatedFiles,
			imagesURL: updatedURLs,
		})
	},
	clearImages: () => {
		const state = get()

		state.imagesURL.forEach((url) => {
			URL.revokeObjectURL(url)
		})
		set({ images: [], imagesURL: [] })
	},
}))

export default usePreviewStore
