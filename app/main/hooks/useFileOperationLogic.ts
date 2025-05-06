import { useMutation } from '@apollo/client'
import { RENAME_FILE, MOVE_FILE } from '@/graphql/mutations'
import { FilesDataType } from '@/types/filesType'
import CustomAlert from '@/utils/customAlert'
import { handleError } from '@/utils/handleError'

type UseFileOperationsProps = {
	closeModal: () => void
	filesRefetch: () => void
	foldersRefetch: () => void
}

export const useFileOperations = ({
	closeModal,
	filesRefetch,
	foldersRefetch,
}: UseFileOperationsProps) => {
	const [renameFile, { loading: renameLoading }] = useMutation(RENAME_FILE)
	const [moveFile, { loading: moveLoading }] = useMutation(MOVE_FILE)

	const handleRename = async (
		data: FilesDataType | undefined,
		newName: string
	) => {
		if (!data) return

		const oldKey = decodeURIComponent(
			new URL(String(data.url)).pathname.slice(1)
		)
		const newKey = oldKey.replace(/[^/]+$/, newName)

		try {
			const res = await renameFile({
				variables: {
					oldKey: encodeURIComponent(oldKey),
					newKey: encodeURIComponent(newKey),
					fileId: data._id,
					newName: newName,
					type: data.type,
				},
			})
			CustomAlert.success(res.data.renameFile)
			refreshData()
			closeModal()
		} catch (error) {
			CustomAlert.error(handleError(error))
		}
	}

	const handleMove = async (
		fileData: FilesDataType | undefined,
		folderData: FilesDataType
	) => {
		if (!fileData) return

		const oldKey = decodeURIComponent(
			new URL(String(fileData.url)).pathname.slice(1)
		)
		const newKey = oldKey.replace(/[^/]+$/, folderData.name)

		try {
			const res = await moveFile({
				variables: {
					oldKey: encodeURIComponent(oldKey),
					newKey: `${newKey}/${fileData.name}`,
					fileId: fileData._id,
					newFolderId: folderData._id,
				},
			})
			CustomAlert.success(res.data.fileMove)
			refreshData()
			closeModal()
		} catch (error) {
			CustomAlert.error(handleError(error))
		}
	}

	const refreshData = () => {
		filesRefetch()
		foldersRefetch()
	}

	return {
		isLoading: renameLoading || moveLoading,
		handleRename,
		handleMove,
	}
}
