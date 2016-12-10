// let favicon = require('./favicon')
let homePage = require('./homepage')
let staticFiles = require('./static-files')
let createNewAdd = require('./create')
let getAllAds = require('./display-all')

module.exports = [
	// favicon,
	homePage,
	createNewAdd,
	getAllAds,
	staticFiles
]