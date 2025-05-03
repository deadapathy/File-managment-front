'use client'

import {
	AppstoreOutlined,
	LoadingOutlined,
	UnorderedListOutlined,
} from '@ant-design/icons'
import { Divider, Flex, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import CreateFolder from './components/CreateFolder'
import { gql, useQuery } from '@apollo/client'
import PreviewImages from './components/PreviewImages'
import { useUploadStore } from '../../store/uploadStatusStore'
import { useFileStore } from '../../store/filesDataStore'
import FileList from './components/FileList'
import BreadCrumb from './components/Breadcrumb'
import { useFolderStore } from '../../store/folderDataStore'

const FILES_DATA = gql`
	query files($folderId: ID) {
		files(folderId: $folderId) {
			_id
			name
			size
			type
			url
			uploadedAt
			folderId
		}
	}
`

const FOLDERS_DATA = gql`
	query {
		folders {
			_id
			name
			size
			url
			uploadedAt
		}
	}
`

const MainPage = () => {
	// STORES
	const { isUploading, statusText } = useUploadStore()
	const { setFiles, setFolders } = useFileStore()
	const { folderData } = useFolderStore()

	// API REQ
	const {
		data: filesData,
		loading: filesLoading,
		refetch: filesRefetch,
	} = useQuery(FILES_DATA, { variables: { folderId: folderData?._id } })
	const {
		data: foldersData,
		loading: foldersLoading,
		refetch: foldersRefetch,
	} = useQuery(FOLDERS_DATA)

	// STATES
	const [filterType, setFilterType] = useState<'list' | 'grid'>('list')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isPreviewModal, setIsPreviewModal] = useState(false)
	const [folderName, setFolderName] = useState<string>('Без названия')

	useEffect(() => {
		if (filesData && filesData.files) {
			console.log(filesData)
			setFiles(filesData.files)
		}
	}, [filesData])

	useEffect(() => {
		if (foldersData && foldersData.folders) {
			setFolders(foldersData.folders)
		}
	}, [foldersData])

	return (
		<>
			<Flex
				vertical
				style={{
					background: 'rgb(42 42 44)',
					height: '88vh',
					borderRadius: 15,
					position: 'relative',
				}}
			>
				{/* HEADER CONTENT */}
				<Flex style={{ padding: 20, justifyContent: 'space-between' }}>
					<BreadCrumb
						setIsModalOpen={setIsModalOpen}
						setIsPreviewModal={setIsPreviewModal}
					/>

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

				{/* MAIN CONTENT */}
				{filesLoading && foldersLoading ? (
					<Spin />
				) : (
					<FileList
						filesRefetch={filesRefetch}
						foldersRefetch={foldersRefetch}
					/>
				)}

				{/* LOADER */}
				{isUploading && (
					<Flex
						style={{
							position: 'absolute',
							bottom: 15,
							right: 15,
							gap: 15,
							background: 'rgb(60, 64, 67)',
							borderRadius: 15,
							padding: 10,
							width: '30%',
						}}
						vertical
					>
						<Typography.Title
							style={{ color: '#fff', textAlign: 'center' }}
							level={5}
						>
							{statusText}
						</Typography.Title>
						<Spin
							indicator={<LoadingOutlined style={{ fontSize: 35 }} spin />}
						/>
					</Flex>
				)}
			</Flex>

			{/* MODALS */}
			<CreateFolder
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				folderName={folderName}
				setFolderName={setFolderName}
				refetch={foldersRefetch}
			/>

			<PreviewImages
				isModalOpen={isPreviewModal}
				setIsModalOpen={setIsPreviewModal}
				refetch={filesRefetch}
			/>
		</>
	)
}

export default MainPage
