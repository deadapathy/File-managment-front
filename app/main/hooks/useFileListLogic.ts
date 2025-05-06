/**
 * The `useFileListLogic` function handles logic related to file and folder operations, including
 * deleting, renaming, moving, and downloading files.
 * @param filesRefetch - The `filesRefetch` parameter is a function that is used to manually trigger a
 * refetch of the files data. This can be useful when you need to update the files data displayed in
 * the component based on some external event or action.
 * @param foldersRefetch - The `foldersRefetch` function is used to manually trigger a refetch of the
 * folders data. This can be useful when you need to update the folders data displayed in your
 * application without a full page reload.
 * @returns The `useFileListLogic` custom hook is returning an object with the following properties and
 * functions
 */
import { useMemo, useEffect, useState } from 'react'
import { useMutation, useLazyQuery } from '@apollo/client'
import { FilesDataType, ModalType } from '@/types/filesType'
import { useFileStore } from '@/store/filesDataStore'
import { useFolderStore } from '@/store/folderDataStore'
import { useUploadStore } from '@/store/uploadStatusStore'
import { DELETE_FILE, DELETE_FOLDER } from '@/graphql/mutations'
import { DOWNLOAD_FILE } from '@/graphql/queries'
import CustomAlert from '@/utils/customAlert'
import { handleError } from '@/utils/handleError'

export type ModalState = {
	open: boolean
	data: FilesDataType | undefined
	type: ModalType
}

export const useFileListLogic = (
	filesRefetch: () => void,
	foldersRefetch: () => void
) => {
	const [modal, setModal] = useState<ModalState>({
		open: false,
		type: undefined,
		data: undefined,
	})

	const { files, folders } = useFileStore()
	const { folderData, setFolderData } = useFolderStore()
	const { setUploading, setStatusText } = useUploadStore()

	const [deleteFile, { loading: deleteFileLoading }] = useMutation(DELETE_FILE)
	const [deleteFolder, { loading: deleteFolderLoading }] =
		useMutation(DELETE_FOLDER)
	const [getDownloadUrl] = useLazyQuery(DOWNLOAD_FILE)

	const getKeyFromUrl = (url: string) => {
		try {
			return decodeURIComponent(new URL(url).pathname.slice(1))
		} catch {
			return ''
		}
	}

	const handleDelete = async (record: FilesDataType) => {
		try {
			if (record.type === 'folder') {
				setStatusText('Удаление папки')
				await deleteFolder({
					variables: {
						folderUrl: getKeyFromUrl(record.url),
						folderId: record._id,
					},
				})
				foldersRefetch()
			} else {
				setStatusText('Удаление файла')
				await deleteFile({
					variables: {
						fileUrl: getKeyFromUrl(record.url),
						fileId: record._id,
					},
				})
				filesRefetch()
			}
		} catch (error) {
			CustomAlert.error(handleError(error, 'Delete'))
		}
	}

	const handleMenuClick = async (key: string, record: FilesDataType) => {
		const fileKey = getKeyFromUrl(record.url)

		switch (key) {
			case '1':
				setModal({ open: true, data: record, type: 'rename' })
				break
			case '2':
				getDownloadUrl({
					variables: { key: fileKey },
					onCompleted: (data) => {
						const downloadUrl = data?.getDownloadUrl
						if (downloadUrl) window.open(downloadUrl, '_blank')
					},
					onError: (err) => CustomAlert.error(err.message),
				})
				break
			case '3':
				handleDelete(record)
				break
			case '4':
				setModal({ open: true, data: record, type: 'move' })
				break
		}
	}

	const handleRowDoubleClick = (record: FilesDataType) => {
		if (record.type === 'folder') {
			setFolderData(record)
		}
	}

	const combinedData = useMemo(() => {
		const filteredFolders = folders
			.filter((folder) => (folderData ? !folder : folder))
			.map((folder) => ({
				...folder,
				type: 'folder',
			}))

		const filteredFiles = files
			.filter((file) =>
				file.folderId ? folderData?._id === file.folderId : file
			)
			.map((file) => ({
				...file,
			}))

		return [...filteredFolders, ...filteredFiles]
	}, [folders, files, folderData])

	useEffect(() => {
		setUploading(deleteFileLoading || deleteFolderLoading)
	}, [deleteFileLoading, deleteFolderLoading])

	return {
		modal,
		setModal,
		handleMenuClick,
		handleRowDoubleClick,
		combinedData,
	}
}
