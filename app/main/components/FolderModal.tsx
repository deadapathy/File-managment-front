import React from 'react'
import { Input, InputRef, Modal } from 'antd'
import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_FOLDER } from '@/graphql/mutations'
import { useUploadStore } from '@/store/uploadStatusStore'
import CustomAlert from '@/utils/customAlert'
import { handleError } from '@/utils/handleError'

type CreateFolderProps = {
	folderName: string
	isModalOpen: boolean
	setIsModalOpen: Dispatch<SetStateAction<boolean>>
	setFolderName: Dispatch<SetStateAction<string>>
	refetch: () => void
}

const CreateFolder = ({
	folderName,
	isModalOpen,
	setIsModalOpen,
	setFolderName,
	refetch,
}: CreateFolderProps) => {
	const inputRef = useRef<InputRef>(null)
	const [createFolder, { loading }] = useMutation(CREATE_FOLDER)
	const { setUploading, setStatusText } = useUploadStore()

	const handleCancel = () => {
		setIsModalOpen(false)
	}

	const handleSend = async () => {
		try {
			setIsModalOpen(false)
			const res = await createFolder({ variables: { folderName } })
			const { message } = res.data.createFolder
			CustomAlert.success(message)
			await refetch()
		} catch (error) {
			CustomAlert.error(handleError(error, 'Delete'))
		}
	}

	useEffect(() => {
		if (isModalOpen) {
			setTimeout(() => {
				inputRef.current?.focus()
			}, 200)
		}
	}, [isModalOpen])

	useEffect(() => {
		setUploading(loading)
		setStatusText('Создание папки')
	}, [loading])

	return (
		<Modal
			title="Новая папка"
			open={isModalOpen}
			onCancel={handleCancel}
			onOk={handleSend}
			centered
		>
			<Input
				ref={inputRef}
				size="large"
				defaultValue={folderName}
				onChange={(e) => setFolderName(e.target.value)}
			/>
		</Modal>
	)
}

export default CreateFolder
