export type FilesDataType = {
	_id: string
	name: string
	size: string
	type: string
	url: string
	uploadedAt: string
	folderId: string
}

export type ModalType = 'rename' | 'move' | undefined
