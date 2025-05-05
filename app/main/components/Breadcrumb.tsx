import React from 'react'
import {
	CaretDownOutlined,
	CloseOutlined,
	RightOutlined,
} from '@ant-design/icons'
import {
	Breadcrumb,
	Button,
	Divider,
	Flex,
	Popover,
	Typography,
	Upload,
} from 'antd'
import { UploadChangeParam, UploadFile } from 'antd/es/upload'
import { Dispatch, SetStateAction, useMemo } from 'react'
import usePreviewStore from '@/store/previewStore'
import { useFolderStore } from '@/store/folderDataStore'

type BreadCrumbProps = {
	setIsModalOpen: Dispatch<SetStateAction<boolean>>
	setIsPreviewModal: Dispatch<SetStateAction<boolean>>
}

const BreadCrumb = ({ setIsModalOpen, setIsPreviewModal }: BreadCrumbProps) => {
	const { setImages, images } = usePreviewStore()
	const { folderData, setFolderData } = useFolderStore()

	const handleUpload = (e: UploadChangeParam<UploadFile<unknown>>) => {
		setImages(e.fileList)
		setIsPreviewModal(true)
	}

	const content = (
		<Flex vertical>
			<Button variant="outlined" onClick={() => setIsModalOpen(true)}>
				Создать папку
			</Button>
			<Divider style={{ margin: 5 }} />
			<Upload
				fileList={images}
				multiple
				showUploadList={false}
				customRequest={() => {}}
				onChange={(e) => handleUpload(e)}
			>
				<Button>Загрузить файлы</Button>
			</Upload>
		</Flex>
	)

	const items = useMemo(() => {
		const base = [
			{
				title: (
					<Popover content={content} placement="bottom">
						<Button
							size="large"
							type="default"
							icon={<CaretDownOutlined />}
							iconPosition="end"
							style={{
								background: 'transparent',
								color: '#fff',
								border: 'none',
							}}
						>
							Мое хранилище
						</Button>
					</Popover>
				),
			},
		]

		if (folderData) {
			base.push({
				title: (
					<Typography.Title
						level={5}
						style={{
							color: '#fff',
							marginLeft: 10,
							marginTop: 5,
							border: '2px solid #fff',
							borderRadius: 10,
							padding: 5,
							alignItems: 'center',
							gap: 10,
							display: 'flex',
						}}
					>
						{folderData.name}

						<CloseOutlined
							style={{ cursor: 'pointer' }}
							onClick={() => setFolderData(undefined)}
						/>
					</Typography.Title>
				),
			})
		}

		return base
	}, [folderData])

	return (
		<Breadcrumb
			separator={<RightOutlined style={{ marginTop: 15 }} />}
			items={items}
		/>
	)
}

export default BreadCrumb
