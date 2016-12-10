let fs = require('fs')
let url = require('url')
let query = require('querystring')

module.exports = function (req, res) {
	req.pathName = req.pathName || url.parse(req.url).pathname
	let intoArr = req.pathName.split('/')
	let carId = ''
	if (intoArr.length > 3) {
		carId = parseInt(intoArr[2])
		if (intoArr[1] === 'details' && intoArr[3] === 'comment') {
			req.pathName = '/details'
		}
	}
	if (req.pathName === '/details') {

		if (req.method === 'POST'){
			let comment = ''
			req.on('data', (data) => {comment += data})
			req.on('end', () => {
				let parsedBody = query.parse(comment)
				// { username: 'one', comment: 'two', 'car-id': '0' }

				let bd = ''
				let readStream = fs.createReadStream('database.json')
				readStream.on('data', (data) => {bd += data})
				readStream.on('end', () => {
					let dt = JSON.parse(bd)
					let counter = dt.counter
					let cars = dt.cars
					
					let currentCar = cars[carId]
					if (typeof currentCar.comments === 'undefined') {
						currentCar.comments = []
					}

					let dateTime = new Date()
					let time = dateTime.getTime()
					currentCar.comments.push({"username": parsedBody['username'], "comment": parsedBody['comment'], 'date': time})

					dt.cars[carId] = currentCar

					let json = JSON.stringify(dt)
					fs.writeFile('database.json', json)
				})
			})
		}

		res.writeHead(200)
		res.write("car with id: " + carId + " deleted")
		res.end()
	} else {
		return true
	}
}