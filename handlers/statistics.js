let fs = require('fs')
let url = require('url')

module.exports = function (req, res) {
	req.pathName = req.pathName || url.parse(req.url).pathname
	if (req.url === '/stats') {
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

			let page = '<!DOCTYPE html>'
			page += '<html><head>'
			page += '<title>Catalog of all cars</title>'
			page += '</head>'
			page += '<body>'
			//here should be filled with the cars
			page += '<ul>'
			cars.forEach((car) =>{
				if (!car['isDeleted']) {
					page += '<li '
					let liCont = ''
					 for (let key in car) {
					 	if (key === 'id') {
					 		page += 'id="' + car[key] + '">';
					 	}

						if (key === 'make') {
							liCont += '<h1>' + key + ': ' + car[key] + '</h1>'
						} else if(key !== 'id' && key !== 'createdOn' && key !== 'comments') {
							liCont += '<p>' + key + ': ' + car[key] + '</p>'
						} else if(key === 'createdOn'){
							liCont += '<p>' + key + ': ' + new Date(car[key]) + '</p>'
						}
					}
					page += liCont
					page += '<p><a href="/details/' + car['id'] + '">Details</a></p>'
					page += '</li>'
				}
			})
			page += '</ul>'
			page += '</body>'
			page += '</html>'
			

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
