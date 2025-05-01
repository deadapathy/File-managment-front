import React from 'react'
import { Flex } from 'antd'
import Header from '../components/header'
import CustomMenu from '../components/menu'

export default function MainLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<Header />
			<Flex>
				<CustomMenu />
				<main
					style={{
						flex: 1,
						overflow: 'auto',
						paddingLeft: 10,
						paddingRight: 10,
					}}
				>
					{children}
				</main>
			</Flex>
		</>
	)
}
