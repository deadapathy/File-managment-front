import { Flex, Modal, Space } from 'antd'
import usePreviewStore from '../../../store/previewStore'
import Image from 'next/image'
import { CloseOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'

type PreviewImagesProps = {
	isModalOpen: boolean
	setIsModalOpen: (isModalOpen: boolean) => void
}

const MULTI_UPLOAD = gql`
	mutation MultiUpload($input: MultiUploadInput!) {
		multiUpload(input: $input)
	}
`

const PreviewImages = ({ isModalOpen, setIsModalOpen }: PreviewImagesProps) => {
	const [multiUpload] = useMutation(MULTI_UPLOAD)
	const { imagesURL, updateImages, images } = usePreviewStore()

	const handleCancel = () => {
		setIsModalOpen(false)
	}

	const handleSend = async () => {
		const fileObjects = images.map((img) => img.originFileObj || img)
		try {
			multiUpload({
				variables: {
					input: {
						files: fileObjects,
					},
				},
			})
		} catch (error) {
			console.error('Upload failed:', error)
		}
	}

	const handleDeleteImage = (index: number) => {
		updateImages(index)
		if (images.length === 0) {
			setIsModalOpen(false)
		}
	}

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
