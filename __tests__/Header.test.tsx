import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MockedProvider } from '@apollo/client/testing'
import { SEARCH_FILES } from '../graphql/queries'
import Header from '@/app/components/header'

jest.mock('../store/filesDataStore', () => ({
	useFileStore: () => ({
		setFiles: jest.fn(),
		setFolders: jest.fn(),
	}),
}))

const pushMock = jest.fn()
jest.mock('next/navigation', () => ({
	useRouter: () => ({
		push: pushMock,
	}),
}))

beforeEach(() => {
	jest.useFakeTimers()
	localStorage.clear()
	pushMock.mockClear()
})

afterEach(() => {
	jest.runOnlyPendingTimers()
	jest.useRealTimers()
})

describe('Header component', () => {
	it('renders logo, title, search input and avatar', () => {
		render(
			<MockedProvider mocks={[]} addTypename={false}>
				<Header />
			</MockedProvider>
		)

		expect(screen.getByText('Storage')).toBeInTheDocument()
		expect(screen.getByTestId('avatar-dropdown')).toBeInTheDocument()
		expect(screen.getByRole('textbox')).toBeInTheDocument()
	})

	it('triggers search query after debounce', async () => {
		const mockResult = {
			request: {
				query: SEARCH_FILES,
				variables: { query: 'test' },
			},
			result: {
				data: {
					searchFiles: [
						{ id: '1', name: 'file1', type: 'txt' },
						{ id: '2', name: 'folder1', type: null },
					],
				},
			},
		}

		render(
			<MockedProvider mocks={[mockResult]} addTypename={false}>
				<Header />
			</MockedProvider>
		)

		fireEvent.change(screen.getByRole('textbox'), {
			target: { value: 'test' },
		})

		jest.advanceTimersByTime(500)

		await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue('test'))
	})

	it('logs out and redirects on menu click', async () => {
		localStorage.setItem('token', 'mock-token')

		render(
			<MockedProvider mocks={[]} addTypename={false}>
				<Header />
			</MockedProvider>
		)

		fireEvent.click(screen.getByTestId('avatar-dropdown'))

		const logoutItem = await screen.findByText('Выйти')
		fireEvent.click(logoutItem)

		expect(localStorage.getItem('token')).toBeNull()
		expect(pushMock).toHaveBeenCalledWith('/login')
	})
})
