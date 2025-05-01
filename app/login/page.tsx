'use client'

import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Flex, Input, Typography } from 'antd'

const LoginPage = () => {
	const { Title } = Typography

	return (
		<Flex
			style={{
				height: '100vh',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Flex
				vertical
				style={{
					width: '400px',
					gap: 15,
					border: '1px solid #fff',
					padding: 20,
					borderRadius: 15,
					alignItems: 'center',
				}}
			>
				<Title level={3} style={{ color: '#fff' }}>
					Авторизация
				</Title>

				<Input placeholder="Login" size="large" />
				<Input.Password
					placeholder="Password"
					type="password"
					size="large"
					iconRender={(visible) =>
						visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
					}
				/>

				<Button size="large"> Авторизоваться </Button>
			</Flex>
		</Flex>
	)
}

export default LoginPage
