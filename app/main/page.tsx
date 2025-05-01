'use client'

import { Flex, Typography } from 'antd'

const MainPage = () => {
	const { Title } = Typography

	return (
		<Flex
			vertical
			style={{
				background: '#131314',
				height: '100%',
				borderRadius: 15,
			}}
		>
			<Flex>
				<Title level={4}>Добро пожаловать</Title>
			</Flex>
		</Flex>
	)
}

export default MainPage
