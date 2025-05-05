'use client'
import React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Flex, Spin, Typography } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const Page = () => {
	const router = useRouter()

	const isLoggedIn =
		typeof window !== 'undefined' && localStorage.getItem('token')

	useEffect(() => {
		if (!isLoggedIn) {
			router.push('/login')
		}

		router.push('/main')
	}, [isLoggedIn])

	return (
		<Flex
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				height: '100%',
				gap: 10,
			}}
			vertical
		>
			<Typography.Title style={{ color: '#fff' }} level={2}>
				Добро пожаловать
			</Typography.Title>
			<Spin indicator={<LoadingOutlined style={{ fontSize: 35 }} spin />} />
		</Flex>
	)
}

export default Page
