import express from 'express'
import bodyParser from 'body-parser'
import logger from 'morgan'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import routes from './routes/index'
import swaggerDoc from '../swagger.json'
// import cronMail from './middleware/mail-sender'

const app = express()
const router = express.Router()

app.use(logger('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// cronMail.start()
routes(router)
app.use('/api/v1/', router)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.get('*', (req, res) =>
	res.status(404).json({ message: 'Request Not Found!' })
)

export default app
