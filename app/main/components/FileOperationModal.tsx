import React, {
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react'
import { Input, InputRef, Modal, Button, Flex, Typography } from 'antd'
import { FolderOutlined } from '@ant-design/icons'
import { useFileStore } from '@/store/filesDataStore'
import { useFileOperations } from '../hooks/useFileOperationLogic'
import '../styles/styles.css'
import { ModalState } from '../hooks/useFileListLogic'

type FileOperationModalProps = {
	modal: ModalState
	setModal: Dispatch<SetStateAction<ModalState>>
	filesRefetch: () => void
	foldersRefetch: () => void
}

const FileOperationModal = ({
	modal,
	setModal,
	filesRefetch,
	foldersRefetch,
}: FileOperationModalProps) => {
	const { folders } = useFileStore()

	const closeModal = () => {
		setModal({ ...modal, open: false })
	}

	const { handleRename, handleMove, isLoading } = useFileOperations({
		closeModal,
		filesRefetch,
		foldersRefetch,
	})

	const inputRef = useRef<InputRef>(null)
	const [newName, setNewName] = useState<string>('')

	useEffect(() => {
		if (modal.open && modal.type === 'rename') {
			setTimeout(() => {
				inputRef.current?.focus()
			}, 200)
			setNewName(String(modal.data?.name))
		}
	}, [modal.open, modal.type, modal.data])

	const handleRenameSend = () => {
		handleRename(modal.data, newName)
	}

	const renderModalContent = () => {
		switch (modal.type) {
			case 'rename':
				return (
					<Input
						ref={inputRef}
						size="large"
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
					/>
				)
			case 'move':
				return (
					<Flex
						style={{
							overflow: 'auto',
							height: folders.length > 10 ? 300 : 'auto',
						}}
					>
						{folders.map((item) => (
							<Flex key={item._id} className="folder-item">
								<FolderOutlined style={{ fontSize: 20, color: '#fff' }} />
								<Typography.Title
									level={5}
									style={{ color: '#fff', margin: 0 }}
								>
									{item.name}
								</Typography.Title>

								<Button
									className="folder-button"
									onClick={() => handleMove(modal.data, item)}
								>
									Переместить
								</Button>
							</Flex>
						))}
					</Flex>
				)
			default:
				return null
		}
	}

	const modalConfig = {
		title: modal.type === 'rename' ? 'Введите новое имя' : 'Выберите папку',
		footer: modal.type === 'rename' ? undefined : null,
		onOk: modal.type === 'rename' ? handleRenameSend : undefined,
	}

	return (
		<Modal
			title={modalConfig.title}
			open={modal.open}
			onCancel={closeModal}
			onOk={modalConfig.onOk}
			footer={modalConfig.footer}
			centered
			loading={isLoading}
		>
			{renderModalContent()}
		</Modal>
	)
}

export default FileOperationModal
