let fs = require('fs')
let url = require('url')

module.exports = function (req, res) {
	req.pathName = req.pathName || url.parse(req.url).pathname
	let intoArr = req.pathName.split('/')
	let carId = ''
	if (intoArr.length > 2) {
		carId = parseInt(intoArr[2])
		req.pathName = '/details'
	}
	if (req.pathName === '/details') {
		let bd = ''
		let readStream = fs.createReadStream('database.json')
		readStream.on('data', (data) => {bd += data})
		readStream.on('end', () => {
			let dt = JSON.parse(bd)
			let counter = dt.counter
			let cars = dt.cars

			cars.sort(function(a, b){
				return a.createdOn - b.createdOn
			})

			let allCars = cars;

			cars = cars.filter(function(car){
				return car.id === carId
			})

			let carToWrite = null

			let page = '<!DOCTYPE html>'
			page += '<html><head>'
			page += '<title>Catalog of all cars</title>'
			page += '</head>'
			page += '<body>'
			//here should be filled with the cars
			page += '<ul>'
			cars.forEach((car) =>{
				if (!car['isDeleted']) {
					carToWrite = car
					page += '<li '
					let liCont = ''
					 for (let key in car) {
					 	if (key === 'id') {
					 		page += 'id="' + car[key] + '">';
					 	}


						if (key === 'make') {
							liCont += '<h1>' + key + ': ' + car[key] + '</h1>'
						} else if(key !== 'id' && key !== 'createdOn') {
							if(key === 'totalViews'){
								liCont += '<p>' + key + ': ' + (parseInt(car[key]) + 1) + '</p>'
							} else {
								liCont += '<p>' + key + ': ' + car[key] + '</p>'
							}
						} else if(key === 'createdOn'){
							liCont += '<p>' + key + ': ' + new Date(car[key]) + '</p>'
						} else if(key === 'id'){
							liCont += '<p>' + key + ': ' + car[key] + '</p>'
						}
					}
					page += liCont
					page += '<p><a href="/delete/' + car['id'] + '">Delete</a></p>'
					page += '</li>'
				}
			})
			page += '</ul>'
			page += '</body>'
			page += '</html>'

			carToWrite['totalViews']++;

			allCars[carToWrite['id']] = carToWrite

			// write into database
			let base = ''
			let readStream = fs.createReadStream('database.json')
			readStream.on('data', (data) => {base += data})
			readStream.on('end', () => {
				let dt1 = JSON.parse(base)
				dt1.cars = allCars
				let json = JSON.stringify(dt1)
				fs.writeFile('database.json', json)
			})
			

			res.writeHead(200, {
				'Content-Type': 'text/html'
			})
			res.write(page)
			res.end()
		})
	} else {
		return true
	}
}