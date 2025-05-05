export const handleError = (error: unknown, context?: string): string => {
	let message = 'Произошла неизвестная ошибка'

	if (typeof error === 'string') {
		message = error
	} else if (typeof error === 'object' && error !== null) {
		if ('message' in error && typeof error.message === 'string') {
			message = error.message
		}
	}

	if (context) {
		console.error(`[${context}]`, error)
	} else {
		console.error(error)
	}

	return message
}
