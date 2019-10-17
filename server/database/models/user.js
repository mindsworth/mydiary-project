const user = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'User',
		{
			firstName: {
				type: DataTypes.STRING,
				allowNull: true
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: true
			},
			userName: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: true
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
				validate: {
					isEmail: true
				}
			},
			password: {
				type: DataTypes.STRING,
				allowNull: true
			},
			bio: {
				type: DataTypes.TEXT,
				allowNull: true
			},
			imageUrl: {
				type: DataTypes.STRING,
				allowNull: true
			},
			createdAt: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW
			},
			updatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW
			}
		},
		{
			tableName: 'users'
		}
	)
	return User
}
export default user
