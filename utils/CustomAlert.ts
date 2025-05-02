import { message } from 'antd'

type MessageType = 'success' | 'warning' | 'error'

const showMessage = (type: MessageType, content: string) => {
	message.open({ type, content })
}

const CustomAlert = {
	success: (content: string) => showMessage('success', content),
	warning: (content: string) => showMessage('warning', content),
	error: (content: string) => showMessage('error', content),
}

export default CustomAlert
