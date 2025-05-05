import { gql } from '@apollo/client'

/* This code snippet is defining a GraphQL query named `SEARCH_FILES` using the `gql` function from the
Apollo Client library. The query is structured to search for files based on a provided query string.
It specifies the fields that should be returned for each file, including `_id`, `name`, `size`,
`type`, `url`, `uploadedAt`, and `folderId`. */
export const SEARCH_FILES = gql`
	query searchFiles($query: String) {
		searchFiles(query: $query) {
			_id
			name
			size
			type
			url
			uploadedAt
			folderId
		}
	}
`

/* The `export const DOWNLOAD_FILE` code snippet is defining a GraphQL query named `DOWNLOAD_FILE`
using the `gql` function from the Apollo Client library. This query is structured to retrieve the
download URL for a specific file based on the provided key. The query takes a variable `` of
type `String!` as an argument and returns the download URL associated with that key. */
export const DOWNLOAD_FILE = gql`
	query getDownloadUrl($key: String!) {
		getDownloadUrl(key: $key)
	}
`

/* The `export const FILES_DATA` code snippet is defining a GraphQL query named `FILES_DATA` using the
`gql` function from the Apollo Client library. This query is structured to retrieve information
about files within a specific folder. */
export const FILES_DATA = gql`
	query files($folderId: ID) {
		files(folderId: $folderId) {
			_id
			name
			size
			type
			url
			uploadedAt
			folderId
		}
	}
`

/* The `const FOLDERS_DATA` code snippet is defining a GraphQL query named `FOLDERS_DATA` using the
`gql` function from the Apollo Client library. This query is structured to retrieve information
about folders in the system. It specifies the fields that should be returned for each folder,
including `_id`, `name`, `size`, `url`, and `uploadedAt`. This query is designed to fetch data
related to folders stored in the system. */
export const FOLDERS_DATA = gql`
	query {
		folders {
			_id
			name
			size
			url
			uploadedAt
		}
	}
`
