'use client'

import React from 'react'
import {
	DeleteOutlined,
	FieldTimeOutlined,
	HomeOutlined,
	StarOutlined,
} from '@ant-design/icons'
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
	{
		key: 'sub1',
		label: <Link href="/favorites">Избранное</Link>,
		icon: <StarOutlined />,
	},
	{
		key: 'sub2',
		label: 'Недавние',
		icon: <FieldTimeOutlined />,
	},
	{
		key: 'sub3',
		label: 'Корзина',
		icon: <DeleteOutlined />,
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
