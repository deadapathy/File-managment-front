import {
	Dropdown,
	Flex,
	Image,
	MenuProps,
	Table,
	TableProps,
	Typography,
} from 'antd'
import { FilesDataType } from '../../../types/filesType'
import { useFileStore } from '../../../store/filesDataStore'
import { FolderOutlined, MoreOutlined } from '@ant-design/icons'
import { useFolderStore } from '../../../store/folderDataStore'
import { gql, useMutation } from '@apollo/client'
import CustomAlert from '../../../utils/CustomAlert'
import { useUploadStore } from '../../../store/uploadStatusStore'
import { useEffect } from 'react'

type FilesListProps = {
	filesRefetch: () => void
	foldersRefetch: () => void
}

const DELETE_FILE = gql`
	mutation DeleteFile($fileUrl: String!, $fileId: ID!) {
		deleteFile(fileUrl: $fileUrl, fileId: $fileId)
	}
`

const DELETE_FOLDER = gql`
	mutation DeleteFolder($folderUrl: String!, $folderId: ID!) {
		deleteFolder(folderUrl: $folderUrl, folderId: $folderId)
	}
`

const rowSelection: TableProps<FilesDataType>['rowSelection'] = {
	onChange: (selectedRowKeys: React.Key[], selectedRows: FilesDataType[]) => {
		console.log(
			`selectedRowKeys: ${selectedRowKeys}`,
			'selectedRows: ',
			selectedRows
		)
	},
	getCheckboxProps: (record: FilesDataType) => ({
		disabled: record.name === 'Disabled User',
		name: record.name,
	}),
}

const FileList = ({ filesRefetch, foldersRefetch }: FilesListProps) => {
	const [deleteFile, { loading: deleteFileLoading }] = useMutation(DELETE_FILE)
	const [deleteFolder, { loading: deleteFolderLoading }] =
		useMutation(DELETE_FOLDER)

	const { files, folders } = useFileStore()
	const { folderData, setFolderData } = useFolderStore()
	const { setUploading, setStatusText } = useUploadStore()

	const menuItems: MenuProps['items'] = [
		{
			key: '1',
			label: 'Переименовать',
		},
		{
			key: '2',
			label: 'Скачать',
		},
		{
			key: '3',
			label: 'Удалить',
		},
	]

	const columns = [
		{
			title: 'Название',
			dataIndex: 'name',
			key: 'name',
			render: (_: any, record: FilesDataType) => {
				return (
					<Flex>
						{record.type === 'folder' ? (
							<FolderOutlined style={{ fontSize: 20 }} />
						) : (
							<Image width={20} src={record.url} />
						)}
						<Typography.Text style={{ color: '#fff', marginLeft: 10 }}>
							{record.name}
						</Typography.Text>
					</Flex>
				)
			},
		},
		{
			title: 'Загружена',
			dataIndex: 'uploadedAt',
			key: 'uploadedAt',
			render: (date: string) => {
				return (
					<Typography.Text style={{ color: '#fff' }}>
						{new Date(Number(date)).toLocaleString()}
					</Typography.Text>
				)
			},
		},
		{
			title: 'Размер файла',
			dataIndex: 'size',
			key: 'size',
			render: (size: string, record: FilesDataType) => {
				const sizeInMB = (Number(size) / 1024 / 1024).toFixed(1)
				return record.type === 'folder' ? (
					<Typography.Text style={{ color: '#fff', fontWeight: 600 }}>
						—
					</Typography.Text>
				) : (
					<Typography.Text style={{ color: '#fff' }}>
						{sizeInMB} MB
					</Typography.Text>
				)
			},
		},
		{
			title: '',
			key: 'action',
			render: (_: any, record: FilesDataType) => {
				return (
					<Flex style={{ justifyContent: 'center' }}>
						<Dropdown
							menu={{
								items: menuItems.filter((menu) => {
									if (record.type === 'folder') {
										return menu?.key !== '2'
									}
									return true
								}),
								onClick: ({ key }) => handleMenuClick(key, record),
							}}
							trigger={['click']}
						>
							<MoreOutlined style={{ fontSize: 25, cursor: 'pointer' }} />
						</Dropdown>
					</Flex>
				)
			},
		},
	]

	const handleMenuClick = async (key: string, record: FilesDataType) => {
		if (key === '1') {
			console.log('Переименовать:', record)
		} else if (key === '2') {
			window.open(record.url)
		} else {
			handleDelete(record)
		}
	}

	const handleDelete = async (record: FilesDataType) => {
		try {
			if (record.type === 'folder') {
				setStatusText('Удаление папки')
				await deleteFolder({
					variables: {
						folderUrl: decodeURIComponent(
							new URL(record.url).pathname.slice(1)
						),
						folderId: record._id,
					},
				})
				foldersRefetch()
			} else {
				setStatusText('Удаление файла')
				await deleteFile({
					variables: {
						fileUrl: decodeURIComponent(new URL(record.url).pathname.slice(1)),
						fileId: record._id,
					},
				})
				filesRefetch()
			}
		} catch (error: any) {
			CustomAlert.error(error.message)
		}
	}

	const handleRowDoubleClick = (record: FilesDataType) => {
		if (record.type === 'folder') {
			setFolderData(record)
		}
	}

	const combinedData = [
		...folders
			.filter((folder) => (folderData ? !folder : folder))
			.map((folder) => ({
				...folder,
				type: 'folder',
			})),
		...files
			.filter((file) => (folderData ? folderData?._id === file.folderId : file))
			.map((file) => ({
				...file,
			})),
	]

	useEffect(() => {
		setUploading(deleteFolderLoading)
		setUploading(deleteFileLoading)
	}, [deleteFileLoading, deleteFolderLoading])

	return (
		<div
			style={{
				padding: 20,
				height: '100%',
				overflow: 'auto',
			}}
		>
			<Table<FilesDataType>
				rowSelection={{ ...rowSelection }}
				columns={columns}
				dataSource={combinedData}
				rowKey={'_id'}
				onRow={(record) => ({
					onDoubleClick: () => handleRowDoubleClick(record),
				})}
				pagination={{ pageSize: 10 }}
			/>
		</div>
	)
}

export default FileList
