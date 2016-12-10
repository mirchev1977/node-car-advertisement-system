let favicon = require('./favicon')
let homePage = require('./homepage')
let staticFiles = require('./static-files')
let createNewAdd = require('./create')
let getAllAds = require('./display-all')
let carView = require('./display-car')
let deleteCar = require('./delete-car')
let undeleteCar = require('./undelete-car')
let addComment = require('./add-comment')

module.exports = [
	// favicon,
	homePage,
	createNewAdd,
	getAllAds,
	deleteCar,
	undeleteCar,
	carView,
	addComment,
	staticFiles
]