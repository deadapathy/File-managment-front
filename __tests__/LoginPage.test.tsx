import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { LOGIN, REGISTER } from '@/graphql/mutations'
import LoginPage from '@/app/login/page'

const pushMock = jest.fn()

jest.mock('next/navigation', () => ({
	useRouter: () => ({
		push: pushMock,
	}),
}))

jest.mock('@/utils/customAlert', () => ({
	default: {
		error: jest.fn(),
	},
}))

beforeEach(() => {
	localStorage.clear()
	jest.clearAllMocks()
})

const mockLogin = {
	request: {
		query: LOGIN,
		variables: { username: 'testuser', password: '123456' },
	},
	result: {
		data: {
			login: {
				token: 'mock-token',
			},
		},
	},
}

const mockRegister = {
	request: {
		query: REGISTER,
		variables: { username: 'newuser', password: '654321' },
	},
	result: {
		data: {
			register: {
				token: 'mock-register-token',
			},
		},
	},
}

describe('LoginPage', () => {
	it('renders login form by default', () => {
		render(
			<MockedProvider>
				<LoginPage />
			</MockedProvider>
		)

		expect(screen.getByText('Авторизация')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('Login')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
		expect(screen.getByText('Войти')).toBeInTheDocument()
	})

	it('switches to register form', () => {
		render(
			<MockedProvider>
				<LoginPage />
			</MockedProvider>
		)

		fireEvent.click(screen.getByText('Нет аккаунта?'))
		expect(screen.getByText('Регистрация')).toBeInTheDocument()
		expect(screen.getByText('Зарегистрироваться')).toBeInTheDocument()
	})

	it('logs in successfully and redirects', async () => {
		render(
			<MockedProvider mocks={[mockLogin]} addTypename={false}>
				<LoginPage />
			</MockedProvider>
		)

		fireEvent.change(screen.getByPlaceholderText('Login'), {
			target: { value: 'testuser' },
		})
		fireEvent.change(screen.getByPlaceholderText('Password'), {
			target: { value: '123456' },
		})
		fireEvent.click(screen.getByText('Войти'))

		await waitFor(() => {
			expect(localStorage.getItem('token')).toBe('mock-token')
			expect(pushMock).toHaveBeenCalledWith('/main')
		})
	})

	it('registers successfully and redirects', async () => {
		render(
			<MockedProvider mocks={[mockRegister]} addTypename={false}>
				<LoginPage />
			</MockedProvider>
		)

		fireEvent.click(screen.getByText('Нет аккаунта?'))

		fireEvent.change(screen.getByPlaceholderText('Login'), {
			target: { value: 'newuser' },
		})
		fireEvent.change(screen.getByPlaceholderText('Password'), {
			target: { value: '654321' },
		})
		fireEvent.click(screen.getByText('Зарегистрироваться'))

		await waitFor(() => {
			expect(localStorage.getItem('token')).toBe('mock-register-token')
			expect(pushMock).toHaveBeenCalledWith('/main')
		})
	})
})
