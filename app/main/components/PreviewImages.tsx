import React from 'react'
import { Flex, Modal, Space } from 'antd'
import Image from 'next/image'
import { CloseOutlined } from '@ant-design/icons'
import { useMutation } from '@apollo/client'
import { useEffect } from 'react'
import { MULTI_UPLOAD } from '@/graphql/mutations'
import usePreviewStore from '@/store/previewStore'
import { useUploadStore } from '@/store/uploadStatusStore'
import { useFolderStore } from '@/store/folderDataStore'
import CustomAlert from '@/utils/customAlert'
import { handleError } from '@/utils/handleError'

type PreviewImagesProps = {
	isModalOpen: boolean
	setIsModalOpen: (isModalOpen: boolean) => void
	refetch: () => void
}

const PreviewImages = ({
	isModalOpen,
	setIsModalOpen,
	refetch,
}: PreviewImagesProps) => {
	const [multiUpload, { loading }] = useMutation(MULTI_UPLOAD)

	const { imagesURL, updateImages, images, clearImages } = usePreviewStore()
	const { setUploading, setStatusText } = useUploadStore()
	const { folderData } = useFolderStore()

	const handleCancel = () => {
		clearImages()
		setIsModalOpen(false)
	}

	const handleSend = async () => {
		const fileObjects = images.map((img) => img.originFileObj || img)

		try {
			setIsModalOpen(false)
			await multiUpload({
				variables: {
					input: {
						files: fileObjects,
					},
					folderId: folderData?._id,
				},
			})
			CustomAlert.success('Files uploaded successfully')
			await refetch()
			clearImages()
		} catch (error) {
			CustomAlert.error(handleError(error))
		}
	}

	const handleDeleteImage = (index: number) => {
		updateImages(index)
		const updatedImages = usePreviewStore.getState().images
		if (updatedImages.length === 0) {
			setIsModalOpen(false)
		}
	}

	useEffect(() => {
		setUploading(loading)
		setStatusText('Загрузка файлов')
	}, [loading])

	return (
		<Modal
			title="Предпросмотр изображений"
			open={isModalOpen}
			onCancel={handleCancel}
			onOk={handleSend}
			centered
		>
			<Flex wrap="wrap" style={{ gap: 10, marginTop: 10 }}>
				{imagesURL.map((src, idx) => (
					<Space style={{ position: 'relative' }} key={idx}>
						<Image
							alt={idx.toString()}
							key={idx}
							src={src}
							width={100}
							height={100}
							style={{ objectFit: 'cover' }}
						/>
						<CloseOutlined
							style={{
								position: 'absolute',
								right: 10,
								top: 3,
								cursor: 'pointer',
							}}
							onClick={() => handleDeleteImage(idx)}
						/>
					</Space>
				))}
			</Flex>
		</Modal>
	)
}

export default PreviewImages
