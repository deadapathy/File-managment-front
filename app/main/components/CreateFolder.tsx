import { Input, InputRef, Modal } from 'antd'
import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { gql, useMutation } from '@apollo/client'
import CustomAlert from '../../../utils/CustomAlert'

type CreateFolderProps = {
	folderName: string
	isModalOpen: boolean
	setIsModalOpen: Dispatch<SetStateAction<boolean>>
	setFolderName: Dispatch<SetStateAction<string>>
}

const CREATE_FOLDER = gql`
	mutation CreateFolder($folderName: String!) {
		createFolder(folderName: $folderName) {
			success
			message
		}
	}
`

const CreateFolder = ({
	folderName,
	isModalOpen,
	setIsModalOpen,
	setFolderName,
}: CreateFolderProps) => {
	const inputRef = useRef<InputRef>(null)
	const [createFolder] = useMutation(CREATE_FOLDER)

	const handleCancel = () => {
		setIsModalOpen(false)
	}

	const handleSend = async () => {
		try {
			const res = await createFolder({ variables: { folderName } })
			const { message } = res.data.createFolder
			CustomAlert.success(message)
			setIsModalOpen(false)
		} catch (error: any) {
			CustomAlert.error(error.message)
		}
	}

	useEffect(() => {
		if (isModalOpen) {
			setTimeout(() => {
				inputRef.current?.focus()
			}, 200)
		}
	}, [isModalOpen])

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
