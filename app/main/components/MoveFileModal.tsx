import React from 'react'
import { Button, Flex, Modal, Typography } from 'antd'
import { FolderOutlined } from '@ant-design/icons'
import '../styles/styles.css'
import { useMutation } from '@apollo/client'
import { useEffect } from 'react'
import { FilesDataType } from '@/types/filesType'
import { MOVE_FILE } from '@/graphql/mutations'
import { useFileStore } from '@/store/filesDataStore'
import { useUploadStore } from '@/store/uploadStatusStore'
import CustomAlert from '@/utils/customAlert'
import { handleError } from '@/utils/handleError'

type MoveFileModalProps = {
	isModalOpen: boolean
	closeModal: () => void
	fileData: FilesDataType | undefined
	filesRefetch: () => void
	foldersRefetch: () => void
}

const MoveFileModal = ({
	isModalOpen,
	closeModal,
	fileData,
	filesRefetch,
	foldersRefetch,
}: MoveFileModalProps) => {
	const [moveFile, { loading }] = useMutation(MOVE_FILE)

	const { folders } = useFileStore()
	const { setUploading, setStatusText } = useUploadStore()

	const handleCancel = () => {
		closeModal()
	}

	const handleMove = async (folderData: FilesDataType) => {
		const oldKey = decodeURIComponent(
			new URL(String(fileData?.url)).pathname.slice(1)
		)
		const newKey = oldKey.replace(/[^/]+$/, folderData.name)

		try {
			closeModal()
			setStatusText('Перемещение файла')
			const res = await moveFile({
				variables: {
					oldKey: encodeURIComponent(oldKey),
					newKey: `${newKey}/${fileData?.name}`,
					fileId: fileData?._id,
					newFolderId: folderData._id,
				},
			})
			CustomAlert.success(res.data.fileMove)
			filesRefetch()
			foldersRefetch()
		} catch (error) {
			CustomAlert.error(handleError(error))
		}
	}

	useEffect(() => {
		setUploading(loading)
	}, [loading])

	return (
		<Modal
			title="Выберите папку"
			open={isModalOpen}
			onCancel={handleCancel}
			centered
			footer
		>
			<Flex
				style={{ overflow: 'auto', height: folders.length > 10 ? 300 : 'auto' }}
			>
				{folders.map((item) => (
					<Flex key={item._id} className="folder-item">
						<FolderOutlined style={{ fontSize: 20, color: '#fff' }} />
						<Typography.Title level={5} style={{ color: '#fff', margin: 0 }}>
							{item.name}
						</Typography.Title>

						<Button className="folder-button" onClick={() => handleMove(item)}>
							Переместить
						</Button>
					</Flex>
				))}
			</Flex>
		</Modal>
	)
}

export default MoveFileModal
