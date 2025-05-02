import React from 'react'
import './globals.css'
import { ConfigProvider } from 'antd'
import '@ant-design/v5-patch-for-react-19'
import ProtectedRoute from './components/protectedRoutes'

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body>
				{
					<ConfigProvider
						theme={{
							components: {
								Menu: {
									itemColor: '#fff',
									itemHoverBg: 'RGB(42, 43, 42)',
									itemHoverColor: '#fff',
									itemSelectedBg: 'RGB(42, 43, 42)',
									itemSelectedColor: '#fff',
									itemActiveBg: 'RGB(42, 43, 42)',
								},
								Modal: {
									contentBg: 'rgb(60, 64, 67)',
									headerBg: 'rgb(60, 64, 67)',
									titleColor: '#fff',
									colorIcon: '#fff',
								},
							},
						}}
					>
						<ProtectedRoute>{children}</ProtectedRoute>
					</ConfigProvider>
				}
			</body>
		</html>
	)
}
