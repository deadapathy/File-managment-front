'use client'

import {
	AppstoreOutlined,
	CaretDownOutlined,
	UnorderedListOutlined,
} from '@ant-design/icons'
import { Button, Divider, Flex, Input, InputRef, Popover, Upload } from 'antd'
import { ChangeEvent, useRef, useState } from 'react'
import CreateFolder from './components/CreateFolder'
import { gql, useQuery } from '@apollo/client'
import usePreviewStore from '../../store/previewStore'
import PreviewImages from './components/PreviewImages'
import { UploadChangeParam, UploadFile } from 'antd/es/upload'

const LIST_FOLDERS = gql`
	query {
		listFolders {
			name
		}
	}
`

const MainPage = () => {
	const { data } = useQuery(LIST_FOLDERS)
	const [filterType, setFilterType] = useState<'list' | 'grid'>('list')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isPreviewModal, setIsPreviewModal] = useState(false)
	const [folderName, setFolderName] = useState<string>('Без названия')
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { setImages } = usePreviewStore()

	const handleFileClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current?.click()
		}
	}

	const handleUpload = (e: UploadChangeParam<UploadFile<any>>) => {
		setImages(e.fileList)
		setIsPreviewModal(true)
	}

	const content = (
		<Flex vertical>
			<Button variant="outlined" onClick={() => setIsModalOpen(!isModalOpen)}>
				Создать папку
			</Button>
			<Divider style={{ margin: 5 }} />
			<Upload
				multiple
				customRequest={() => {}}
				onChange={(e) => handleUpload(e)}
			>
				<Button>Загрузить файлы</Button>
			</Upload>
		</Flex>
	)

	return (
		<>
			<Flex
				vertical
				style={{
					background: '#131314',
					height: '85%',
					borderRadius: 15,
				}}
			>
				<Flex style={{ padding: 20, justifyContent: 'space-between' }}>
					<Popover
						content={content}
						placement="bottom"
						style={{ background: 'rgb(60, 64, 67)' }}
					>
						<Button
							size="large"
							type="default"
							variant="outlined"
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

					<Flex
						style={{
							gap: 10,
							border: '2px solid #fff',
							padding: 10,
							borderRadius: 15,
						}}
					>
						<UnorderedListOutlined
							style={{
								color: filterType === 'list' ? '#7fcfff' : '#fff',
								fontSize: 20,
								cursor: 'pointer',
							}}
							onClick={() => setFilterType('list')}
						/>
						<Divider
							type="vertical"
							style={{ background: '#fff', height: '100%', margin: 0 }}
						/>
						<AppstoreOutlined
							style={{
								color: filterType === 'grid' ? '#7fcfff' : '#fff',
								fontSize: 20,
								cursor: 'pointer',
							}}
							onClick={() => setFilterType('grid')}
						/>
					</Flex>
				</Flex>
			</Flex>

			<CreateFolder
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				folderName={folderName}
				setFolderName={setFolderName}
			/>

			<PreviewImages
				isModalOpen={isPreviewModal}
				setIsModalOpen={setIsPreviewModal}
			/>
		</>
	)
}

export default MainPage
