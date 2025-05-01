'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

type ProtectedRouteProps = {
	isLoggedIn: boolean
	children: React.ReactNode
}

const ProtectedRoute = ({ isLoggedIn, children }: ProtectedRouteProps) => {
	const router = useRouter()

	useEffect(() => {
		if (!isLoggedIn) {
			router.push('/login')
		}
	}, [isLoggedIn, router])

	return <>{children}</>
}

export default ProtectedRoute
