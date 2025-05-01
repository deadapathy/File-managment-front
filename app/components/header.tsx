'use client'

import {
	AntCloudOutlined,
	SearchOutlined,
	UserOutlined,
} from '@ant-design/icons'
import { Flex, Input, Typography } from 'antd'

const Header = () => {
	const { Title } = Typography

	return (
		<Flex
			style={{
				justifyContent: 'space-between',
				padding: 10,
				alignItems: 'center',
			}}
		>
			<Flex style={{ alignItems: 'center' }}>
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
					placeholder="Поиск по хранилищу"
					size="large"
					prefix={<SearchOutlined />}
					style={{
						marginRight: 10,
						minWidth: 100,
						width: '100%',
						maxWidth: 500,
					}}
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
