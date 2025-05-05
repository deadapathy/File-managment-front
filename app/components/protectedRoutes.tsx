'use client'
import React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ApolloProviderWrapper from '@/lib/ApolloProvider'

type ProtectedRouteProps = {
	children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const router = useRouter()
	const isLoggedIn =
		typeof window !== 'undefined' && localStorage.getItem('token')

	useEffect(() => {
		if (!isLoggedIn) {
			router.push('/login')
		}
	}, [isLoggedIn, router])

	return <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
}

export default ProtectedRoute
