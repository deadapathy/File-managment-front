'use client'

import React from 'react'
import { HomeOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import Link from 'next/link'

type MenuItem = Required<MenuProps>['items'][number]

const items: MenuItem[] = [
	{
		key: '/',
		label: <Link href="/">Главная</Link>,
		icon: <HomeOutlined />,
	},
]

const CustomMenu = () => {
	return (
		<div style={{ height: '100vh', width: 256 }}>
			<Menu
				style={{
					width: 256,
					height: '100%',
					background: 'rgb(60,64,67)',
					color: '#fff',
					border: 'none',
				}}
				defaultSelectedKeys={['/']}
				mode="inline"
				items={items}
				activeKey="main"
			/>
		</div>
	)
}

export default CustomMenu
