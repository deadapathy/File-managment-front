import React from 'react'
import { render, screen } from '@testing-library/react'
import ProtectedRoute from '@/app/components/protectedRoutes'

const pushMock = jest.fn()

jest.mock('next/navigation', () => ({
	useRouter: () => ({
		push: pushMock,
	}),
}))

jest.mock('../lib/ApolloProvider', () => {
	const MockApolloProvider = ({ children }: { children: React.ReactNode }) => (
		<div data-testid="apollo-wrapper">{children}</div>
	)
	MockApolloProvider.displayName = 'MockApolloProvider'
	return MockApolloProvider
})

beforeEach(() => {
	localStorage.clear()
	pushMock.mockClear()
})

describe('ProtectedRoute', () => {
	it('renders children when token is present', () => {
		localStorage.setItem('token', 'mock-token')

		render(
			<ProtectedRoute>
				<p>Protected Content</p>
			</ProtectedRoute>
		)

		expect(screen.getByText('Protected Content')).toBeInTheDocument()
		expect(pushMock).not.toHaveBeenCalled()
	})

	it('redirects to /login when token is missing', () => {
		render(
			<ProtectedRoute>
				<p>Protected Content</p>
			</ProtectedRoute>
		)

		expect(pushMock).toHaveBeenCalledWith('/login')
	})
})
