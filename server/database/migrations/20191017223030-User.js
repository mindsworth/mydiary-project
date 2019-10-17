module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			firstName: {
				type: Sequelize.STRING
			},
			lastName: {
				type: Sequelize.STRING
			},
			userName: {
				type: Sequelize.STRING,
				primaryKey: true
			},
			email: {
				type: Sequelize.STRING,
				primaryKey: true
			},
			password: {
				type: Sequelize.STRING
			},
			bio: {
				type: Sequelize.STRING
			},
			imageUrl: {
				type: Sequelize.STRING
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		})
	},

	down: queryInterface => {
		return queryInterface.dropTable('users')
	}
}
