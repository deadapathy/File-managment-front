import React from 'react'
import { ApolloProvider } from '@apollo/client'
import client from './apollo-client'
import { ReactNode } from 'react'

const ApolloProviderWrapper = ({ children }: { children: ReactNode }) => {
	return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default ApolloProviderWrapper
