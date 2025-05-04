'use client'

import {
	AntCloudOutlined,
	SearchOutlined,
	UserOutlined,
} from '@ant-design/icons'
import { gql, useLazyQuery } from '@apollo/client'
import { Flex, Input, Typography } from 'antd'
import { ChangeEvent } from 'react'
import { FilesDataType } from '../../types/filesType'
import { useFileStore } from '../../store/filesDataStore'

const SEARCH_FILES = gql`
	query searchFiles($query: String) {
		searchFiles(query: $query) {
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

const Header = () => {
	const { Title } = Typography
	const { setFiles, setFolders } = useFileStore()

	let debounceTimeout: NodeJS.Timeout
	const [searchData] = useLazyQuery(SEARCH_FILES)

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value

		clearTimeout(debounceTimeout)

		debounceTimeout = setTimeout(() => {
			searchData({
				variables: { query: value },
				onCompleted: (data) => {
					const folders = data.searchFiles.filter(
						(item: FilesDataType) => !item.type
					)
					const files = data.searchFiles.filter(
						(item: FilesDataType) => item.type
					)

					setFolders(folders)
					setFiles(files)
				},
			})
		}, 500)
	}

	return (
		<Flex
			style={{
				justifyContent: 'space-between',
				padding: 10,
				alignItems: 'center',
			}}
		>
			<Flex style={{ alignItems: 'center', gap: 10 }}>
				<AntCloudOutlined style={{ fontSize: 40, color: '#fff' }} />
				<Title
					level={3}
					style={{ color: '#fff', marginLeft: 10, marginBottom: 0 }}
				>
					Storage
				</Title>
			</Flex>
			<Flex style={{ width: '40%' }}>
				<Input
					size="large"
					prefix={<SearchOutlined />}
					style={{
						marginRight: 10,
						minWidth: 100,
						width: '100%',
						maxWidth: 500,
						backgroundColor: 'RGB(61, 64, 66)',
						color: '#fff',
						borderWidth: 2,
					}}
					onChange={(e) => handleInputChange(e)}
				/>
			</Flex>
			<Flex>
				<div
					style={{
						border: '2px solid #fff',
						borderRadius: 50,
						padding: 10,
						cursor: 'pointer',
					}}
				>
					<UserOutlined style={{ fontSize: 30, color: '#fff' }} />
				</div>
			</Flex>
		</Flex>
	)
}

export default Header
