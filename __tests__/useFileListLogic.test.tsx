import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { DELETE_FILE } from '@/graphql/mutations'
import { DOWNLOAD_FILE } from '@/graphql/queries'
import { useFileListLogic } from '@/app/main/hooks/useFileListLogic'

jest.mock('@/store/filesDataStore', () => ({
	useFileStore: () => ({
		files: [
			{
				_id: 'f1',
				name: 'file.txt',
				type: 'text/plain',
				url: 'http://test.com/file.txt',
			},
		],
		folders: [
			{ _id: 'd1', name: 'docs', url: 'http://test.com/docs', type: 'folder' },
		],
	}),
}))

jest.mock('@/store/folderDataStore', () => ({
	useFolderStore: () => ({
		folderData: null,
		setFolderData: jest.fn(),
	}),
}))

jest.mock('@/store/uploadStatusStore', () => ({
	useUploadStore: () => ({
		setUploading: jest.fn(),
		setStatusText: jest.fn(),
	}),
}))

jest.mock('@/utils/customAlert', () => ({
	default: {
		error: jest.fn(),
		success: jest.fn(),
	},
}))

jest.mock('@/utils/handleError', () => ({
	handleError: () => 'Mocked error',
}))

const mocks = [
	{
		request: {
			query: DELETE_FILE,
			variables: { fileUrl: 'file.txt', fileId: 'f1' },
		},
		result: { data: { deleteFile: true } },
	},
	{
		request: {
			query: DOWNLOAD_FILE,
			variables: { key: 'file.txt' },
		},
		result: { data: { getDownloadUrl: 'http://download.com/file.txt' } },
	},
]

describe('useFileListLogic', () => {
	it('opens rename modal', async () => {
		const { result } = renderHook(
			() => useFileListLogic(jest.fn(), jest.fn()),
			{
				wrapper: ({ children }) => (
					<MockedProvider mocks={mocks}>{children}</MockedProvider>
				),
			}
		)

		const file = {
			_id: 'f1',
			name: 'file.txt',
			url: 'http://test.com/file.txt',
			size: '1234',
			type: 'text/plain',
			uploadedAt: new Date().toISOString(),
			folderId: '',
		}

		await act(() => {
			result.current.handleMenuClick('1', file)
		})

		expect(result.current.modal).toEqual({
			open: true,
			type: 'rename',
			data: file,
		})
	})

	it('opens download URL', async () => {
		global.open = jest.fn()

		const { result } = renderHook(
			() => useFileListLogic(jest.fn(), jest.fn()),
			{
				wrapper: ({ children }) => (
					<MockedProvider mocks={mocks} addTypename={false}>
						{children}
					</MockedProvider>
				),
			}
		)

		const file = {
			_id: 'f1',
			name: 'file.txt',
			url: 'http://test.com/file.txt',
			size: '1234',
			type: 'text/plain',
			uploadedAt: new Date().toISOString(),
			folderId: '',
		}

		await act(() => {
			result.current.handleMenuClick('2', file)
		})

		await new Promise((res) => setTimeout(res, 0)) // дождаться завершения запроса

		expect(global.open).toHaveBeenCalledWith(
			'http://download.com/file.txt',
			'_blank'
		)
	})
})
