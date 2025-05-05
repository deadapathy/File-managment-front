'use client'
import React from 'react'
import {
	AntCloudOutlined,
	SearchOutlined,
	UserOutlined,
} from '@ant-design/icons'
import { useLazyQuery } from '@apollo/client'
import { Avatar, Dropdown, Flex, Input, MenuProps, Typography } from 'antd'
import { ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useFileStore } from '@/store/filesDataStore'
import { SEARCH_FILES } from '@/graphql/queries'
import { FilesDataType } from '@/types/filesType'

const menuItems: MenuProps['items'] = [
	{
		key: '1',
		label: 'Профиль',
	},
	{
		key: '2',
		label: 'Выйти',
	},
]

const Header = () => {
	const { Title } = Typography
	const router = useRouter()
	const { setFiles, setFolders } = useFileStore()
	const [searchData] = useLazyQuery(SEARCH_FILES)

	let debounceTimeout: NodeJS.Timeout

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

	const handleMenuClick = (key: string) => {
		if (key === '2') {
			localStorage.removeItem('token')
			router.push('/login')
		}
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
				<Dropdown
					menu={{
						items: menuItems,
						onClick: ({ key }) => handleMenuClick(key),
					}}
					trigger={['click']}
				>
					<Avatar
						data-testid="avatar-dropdown"
						size={50}
						icon={<UserOutlined />}
						style={{ cursor: 'pointer' }}
					/>
				</Dropdown>
			</Flex>
		</Flex>
	)
}

export default Header
