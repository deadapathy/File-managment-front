import React from 'react'
import { Dropdown, Flex, Image, MenuProps, Table, Typography } from 'antd'
import { FolderOutlined, MoreOutlined } from '@ant-design/icons'
import RenameModal from './RenameModal'
import MoveFileModal from './MoveFileModal'
import { useFileListLogic } from '../hooks/useFileListLogic'
import { FilesDataType } from '@/types/filesType'

type FilesListProps = {
	filesRefetch: () => void
	foldersRefetch: () => void
}

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
	{
		key: '4',
		label: 'Переместить',
	},
]

const FileList = ({ filesRefetch, foldersRefetch }: FilesListProps) => {
	const columns = [
		{
			title: 'Название',
			dataIndex: 'name',
			key: 'name',
			render: (_: unknown, record: FilesDataType) => {
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
			render: (_: unknown, record: FilesDataType) => {
				return (
					<Flex style={{ justifyContent: 'center' }}>
						<Dropdown
							menu={{
								items: menuItems.filter((menu) => {
									if (record.type === 'folder') {
										return menu?.key !== '2' && menu?.key !== '4'
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

	const {
		modal,
		setModal,
		handleMenuClick,
		handleRowDoubleClick,
		combinedData,
	} = useFileListLogic(filesRefetch, foldersRefetch)

	return (
		<div
			style={{
				padding: 20,
				height: '100%',
				overflow: 'auto',
			}}
		>
			<Table<FilesDataType>
				columns={columns}
				dataSource={combinedData}
				rowKey={'_id'}
				onRow={(record) => ({
					onDoubleClick: () => handleRowDoubleClick(record),
				})}
				pagination={{ pageSize: 10 }}
			/>

			{modal.type === 'rename' && (
				<RenameModal
					closeModal={() => setModal({ ...modal, open: false })}
					isModalOpen={modal.open}
					data={modal.data}
					filesRefetch={filesRefetch}
					foldersRefetch={foldersRefetch}
				/>
			)}

			{modal.type === 'move' && (
				<MoveFileModal
					isModalOpen={modal.open}
					closeModal={() => setModal({ ...modal, open: false })}
					fileData={modal.data}
					filesRefetch={filesRefetch}
					foldersRefetch={foldersRefetch}
				/>
			)}
		</div>
	)
}

export default FileList
