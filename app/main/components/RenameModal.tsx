import React from 'react'
import { Input, InputRef, Modal } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@apollo/client'
import { FilesDataType } from '@/types/filesType'
import { useUploadStore } from '@/store/uploadStatusStore'
import { RENAME_FILE } from '@/graphql/mutations'
import CustomAlert from '@/utils/customAlert'
import { handleError } from '@/utils/handleError'

type RenameModalProps = {
	isModalOpen: boolean
	closeModal: () => void
	data: FilesDataType | undefined
	filesRefetch: () => void
	foldersRefetch: () => void
}

const RenameModal = ({
	isModalOpen,
	closeModal,
	data,
	filesRefetch,
	foldersRefetch,
}: RenameModalProps) => {
	const { setUploading, setStatusText } = useUploadStore()

	const [renameFile, { loading }] = useMutation(RENAME_FILE)

	const inputRef = useRef<InputRef>(null)
	const [newName, setNewName] = useState<string>('')

	const handleCancel = () => {
		closeModal()
	}

	const handleSend = async () => {
		const oldKey = decodeURIComponent(
			new URL(String(data?.url)).pathname.slice(1)
		)
		const newKey = oldKey.replace(/[^/]+$/, newName)

		try {
			closeModal()
			setStatusText('Обновление файлов')
			const res = await renameFile({
				variables: {
					oldKey: encodeURIComponent(oldKey),
					newKey: encodeURIComponent(newKey),
					fileId: data?._id,
					newName: newName,
					type: data?.type,
				},
			})
			CustomAlert.success(res.data.renameFile)
			filesRefetch()
			foldersRefetch()
		} catch (error) {
			CustomAlert.error(handleError(error))
		}
	}

	useEffect(() => {
		if (isModalOpen) {
			setTimeout(() => {
				inputRef.current?.focus()
			}, 200)
		}
		setNewName(String(data?.name))
	}, [isModalOpen])

	useEffect(() => {
		setUploading(loading)
	}, [loading])

	return (
		<Modal
			title="Введите новое имя"
			open={isModalOpen}
			onCancel={handleCancel}
			onOk={handleSend}
			centered
		>
			<Input
				ref={inputRef}
				size="large"
				value={newName}
				onChange={(e) => setNewName(e.target.value)}
			/>
		</Modal>
	)
}

export default RenameModal
