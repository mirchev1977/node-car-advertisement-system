let fs = require('fs')
let url = require('url')

module.exports = function (req, res) {
	req.pathName = req.pathName || url.parse(req.url).pathname
	let intoArr = req.pathName.split('/')
	let carId = ''
	if (intoArr.length > 2) {
		carId = parseInt(intoArr[2])
		if (intoArr[1] === 'undelete') {
			req.pathName = '/undelete'
		}
	}
	if (req.pathName === '/undelete') {
		let bd = ''
		let readStream = fs.createReadStream('database.json')
		readStream.on('data', (data) => {bd += data})
		readStream.on('end', () => {
			let dt = JSON.parse(bd)
			let counter = dt.counter
			let cars = dt.cars
			
			let currentCar = cars[carId]
			currentCar['isDeleted'] = false
			dt.cars[carId] = currentCar

			let json = JSON.stringify(dt)
			fs.writeFile('database.json', json)
		})

		res.writeHead(200)
		res.write("car with id: " + carId + " car undeleted")
		res.end()
	} else {
		return true
	}
}
