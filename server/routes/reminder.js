import ReminderController from '../controllers/reminder'
import Auth from '../middleware/check-auth'

const reminderRoutes = router => {
	router
		.route('/user/reminder')
		.put(Auth.verifyToken, ReminderController.updateReminder)
}

export default reminderRoutes
