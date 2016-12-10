let fs = require('fs')
let url = require('url')

module.exports = function (req, res) {
	req.pathName = req.pathName || url.parse(req.url).pathname
	let intoArr = req.pathName.split('/')
	let carId = ''
	if (intoArr.length > 2 && intoArr.length < 4) {
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

			let carToWrite = 0

			let page = '<!DOCTYPE html>'
			page += '<html><head>'
			page += '<title>Catalog of all cars</title>'
			page += '</head>'
			page += '<body>'
			//here should be filled with the cars
			page += '<ul>'
			cars.forEach((car) =>{
				// if (!car['isDeleted']) {
					carToWrite = car
					page += '<li '
					let liCont = ''
					 for (let key in car) {
					 	if (key === 'id') {
					 		page += 'id="' + car[key] + '">';
					 	}


						if (key === 'make') {
							liCont += '<h1>' + key + ': ' + car[key] + '</h1>'
						} else if(key !== 'id' && key !== 'createdOn' && key !== 'comments') {
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
					page += '<p><a href="/undelete/' + car['id'] + '">Undelete</a></p>'
					page += '</li>'
				// }
			})
			page += '</ul>'
			//display the form here
			page += '<form action =  "/details/' + carId + '/comment" method="POST">' + 
				'<label>Username<input type="text" name="username" /></label><br />'+
				'<label>Comment<input type="text" name="comment" /></label><br />'+
				'<input type="hidden" name="car-id"  value="' + carId + '"/><br />'+
				'<input type="submit" />'+
			'</form>'

			if (cars.length > 0) {
				let currentCar = cars[0]
				if (typeof currentCar !== 'undefined') {
					if(currentCar.hasOwnProperty('comments') && typeof currentCar.comments !== 'undefined'){
						page += '<br></br><h1>Comments...</h1>'
						page += '<ul>'
						currentCar.comments.forEach(function(comment){
							let liCont = ''
							page += '<li style="border: solid 1px black">'
							for(let key in comment){
								if(key === 'time'){
									liCont += '<p>' + key + ': ' + new Date(comment[key]) + '</p>'
								} else {
									liCont += '<p>' + key + ': ' + comment[key] + '</p>'
								}
							}
							page += liCont
							page += '</li>'
						})
						page += '</ul>'
					}
				}
			}

			page += '</body>'
			page += '</html>'

			// write into database
			let base = ''
			let readStream = fs.createReadStream('database.json')
			readStream.on('data', (data) => {base += data})
			readStream.on('end', () => {
				carToWrite['totalViews']++;
				allCars[carToWrite['id']] = carToWrite
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
