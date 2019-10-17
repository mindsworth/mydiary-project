import FavoriteController from '../controllers/favorite'
import Auth from '../middleware/check-auth'

const favoriteRoutes = router => {
	router
		.route('/favorite')
		.get(Auth.verifyToken, FavoriteController.getAllFavoriteEntries)
	router
		.route('/favorite/:entryId')
		.put(Auth.verifyToken, FavoriteController.toggleFavoriate)
}

export default favoriteRoutes
