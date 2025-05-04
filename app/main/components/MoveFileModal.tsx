import { Button, Flex, Modal, Typography } from 'antd'
import { useFileStore } from '../../../store/filesDataStore'
import { FolderOutlined } from '@ant-design/icons'
import '../styles/styles.css'
import { gql, useMutation } from '@apollo/client'
import { FilesDataType } from '../../../types/filesType'
import CustomAlert from '../../../utils/CustomAlert'
import { useUploadStore } from '../../../store/uploadStatusStore'
import { useEffect } from 'react'

type MoveFileModalProps = {
	isModalOpen: boolean
	closeModal: () => void
	fileData: FilesDataType | undefined
	filesRefetch: () => void
	foldersRefetch: () => void
}

const MOVE_FILE = gql`
	mutation fileMove(
		$oldKey: String!
		$newKey: String!
		$fileId: ID!
		$newFolderId: ID
	) {
		fileMove(
			oldKey: $oldKey
			newKey: $newKey
			fileId: $fileId
			newFolderId: $newFolderId
		)
	}
`

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
		} catch (error: any) {
			CustomAlert.error(error.message)
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
