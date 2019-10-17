import http from 'http'
import app from './app'

const port = process.env.PORT || 5000

const server = http.createServer(app)

server.listen(port, () => {
	console.log(`Server listening at port ${port}`)
})

export default server
