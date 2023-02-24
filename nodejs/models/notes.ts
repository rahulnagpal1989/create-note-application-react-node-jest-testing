"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize:object, DataTypes:any) => {
	class Notes extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models:string) {
			// define association here
		}
	}
	Notes.init({
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		note: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        status: {
			type: DataTypes.INTEGER,
		},
	},
    {
      sequelize,
      modelName: "Notes",
      tableName: "Notes",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    });
	return Notes;
};
