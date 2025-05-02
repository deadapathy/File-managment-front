import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('token')
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
			'apollo-require-preflight': 'true',
		},
	}
})

const uploadLink = createUploadLink({
	uri: 'http://localhost:5000/',
	credentials: 'same-origin',
})

const client = new ApolloClient({
	link: ApolloLink.from([authLink, uploadLink]),
	cache: new InMemoryCache(),
})

export default client
