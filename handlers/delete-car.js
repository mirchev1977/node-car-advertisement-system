let fs = require('fs')
let url = require('url')

module.exports = function (req, res) {
	req.pathName = req.pathName || url.parse(req.url).pathname
	let intoArr = req.pathName.split('/')
	let carId = ''
	if (intoArr.length > 2) {
		carId = parseInt(intoArr[2])
		if (intoArr[1] === 'delete') {
			req.pathName = '/delete'
		}
	}
	if (req.pathName === '/delete') {
		let bd = ''
		let readStream = fs.createReadStream('database.json')
		readStream.on('data', (data) => {bd += data})
		readStream.on('end', () => {
			let dt = JSON.parse(bd)
			let counter = dt.counter
			let cars = dt.cars
			
			let currentCar = cars[carId]
			currentCar['isDeleted'] = true
			dt.cars[carId] = currentCar

			let json = JSON.stringify(dt)
			fs.writeFile('database.json', json)
		})

		res.writeHead(200)
		res.write("car with id: " + carId + " deleted")
		res.end()
	} else {
		return true
	}
}
