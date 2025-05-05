import { gql } from '@apollo/client'

/* This code snippet is defining a GraphQL mutation operation named `REGISTER`. The mutation operation
takes two variables, `username` and `password`, both of type `String!`. */
export const REGISTER = gql`
	mutation Register($username: String!, $password: String!) {
		register(username: $username, password: $password) {
			id
			username
			token
		}
	}
`
/* The code snippet you provided is defining a GraphQL mutation operation named `LOGIN`. This mutation
operation takes two variables, `username` and `password`, both of type `String!`. */
export const LOGIN = gql`
	mutation Login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			username
			token
		}
	}
`

/* The code snippet `export const DELETE_FILE = gql` is defining a GraphQL mutation operation named
`DELETE_FILE`. This mutation operation is intended to delete a file based on the provided `fileUrl`
and `fileId` variables. */
export const DELETE_FILE = gql`
	mutation DeleteFile($fileUrl: String!, $fileId: ID!) {
		deleteFile(fileUrl: $fileUrl, fileId: $fileId)
	}
`

/* The code snippet `export const DELETE_FOLDER = gql` is defining a GraphQL mutation operation named
`DELETE_FOLDER`. This mutation operation is intended to delete a folder based on the provided
variables `folderUrl` of type `String!` and `folderId` of type `ID!`. The mutation operation
`deleteFolder` is called with these variables to delete the folder specified by the `folderUrl` and
`folderId`. */
export const DELETE_FOLDER = gql`
	mutation DeleteFolder($folderUrl: String!, $folderId: ID!) {
		deleteFolder(folderUrl: $folderUrl, folderId: $folderId)
	}
`

/* The code snippet `const CREATE_FOLDER = gql` is defining a GraphQL mutation operation named
`CREATE_FOLDER`. This mutation operation is intended to create a new folder in the system. It takes
a variable `folderName` of type `String!` as input. */
export const CREATE_FOLDER = gql`
	mutation CreateFolder($folderName: String!) {
		createFolder(folderName: $folderName) {
			success
			message
		}
	}
`

/* The `MOVE_FILE` constant is defining a GraphQL mutation operation named `fileMove`. This mutation
operation is used to move a file from one location to another within the system. It takes four
variables as input: */
export const MOVE_FILE = gql`
	mutation fileMove(
		$oldKey: String!
		$newKey: String!
		$fileId: ID!
		$newFolderId: ID
	) {
		fileMove(
			oldKey: $oldKey
			newKey: $newKey
			fileId: $fileId
			newFolderId: $newFolderId
		)
	}
`

/* The `export const MULTI_UPLOAD` constant is defining a GraphQL mutation operation named
`MultiUpload`. This mutation operation is used for performing a multi-upload action, likely for
uploading multiple files at once. */
export const MULTI_UPLOAD = gql`
	mutation MultiUpload($input: MultiUploadInput!, $folderId: ID) {
		multiUpload(input: $input, folderId: $folderId)
	}
`

/* The `RENAME_FILE` constant is defining a GraphQL mutation operation named `RenameFile`. This
mutation operation is used to rename a file within the system. It takes several variables as input: */
export const RENAME_FILE = gql`
	mutation RenameFile(
		$oldKey: String!
		$newKey: String!
		$fileId: ID!
		$newName: String!
		$type: String!
	) {
		renameFile(
			fileId: $fileId
			oldKey: $oldKey
			newKey: $newKey
			newName: $newName
			type: $type
		)
	}
`
