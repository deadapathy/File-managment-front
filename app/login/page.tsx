'use client'

import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Flex, Input, Typography } from 'antd'
import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CustomAlert from '../../utils/CustomAlert'

const REGISTER = gql`
	mutation Register($username: String!, $password: String!) {
		register(username: $username, password: $password) {
			id
			username
			token
		}
	}
`
const LOGIN = gql`
	mutation Login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			username
			token
		}
	}
`

const LoginPage = () => {
	const router = useRouter()
	const { Title } = Typography
	const [typeForm, setTypeForm] = useState<'register' | 'login'>('login')
	const [loginForm, setLoginForm] = useState({ username: '', password: '' })
	const [register] = useMutation(REGISTER)
	const [login] = useMutation(LOGIN)

	const handleAuth = async (action: 'login' | 'register') => {
		try {
			const mutation = action === 'login' ? login : register
			const res = await mutation({ variables: loginForm })
			const token = res.data[action].token
			localStorage.setItem('token', token)
			router.push('/main')
		} catch (error: any) {
			CustomAlert.error(error.message)
		}
	}

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
					{typeForm === 'login' ? 'Авторизация' : 'Регистрация'}
				</Title>

				<Input
					placeholder="Login"
					size="large"
					onChange={(e) =>
						setLoginForm({ ...loginForm, username: e.target.value })
					}
				/>
				<Input.Password
					placeholder="Password"
					type="password"
					size="large"
					iconRender={(visible) =>
						visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
					}
					onChange={(e) =>
						setLoginForm({ ...loginForm, password: e.target.value })
					}
				/>

				<Button
					size="large"
					onClick={() =>
						typeForm === 'register'
							? handleAuth('register')
							: handleAuth('login')
					}
				>
					{typeForm === 'login' ? 'Войти' : 'Зарегистрироваться'}
				</Button>

				{typeForm === 'login' && (
					<Typography.Text
						style={{ color: '#fff', cursor: 'pointer' }}
						onClick={() => setTypeForm('register')}
					>
						Нет аккаунта?
					</Typography.Text>
				)}
			</Flex>
		</Flex>
	)
}

export default LoginPage
