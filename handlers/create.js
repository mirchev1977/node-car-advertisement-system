let fs = require('fs')
let url = require('url')
let query = require('querystring')

module.exports = function (req, res) {
	req.pathName = req.pathName || url.parse(req.url).pathname
	if (req.url === '/create') {
		if (req.method === 'GET') {
			fs.readFile('./create-add.html', 'utf8', (err, data) => {
				if (err) {console.log(err)}

				res.writeHead(200, {
					'Content-Type': 'text/html'
				})
				res.write(data)
				res.end()
			})
		} else if (req.method === 'POST') {
			let body = ''
			req.on('data', (data) => {body += data})
			req.on('end', () => {
				let parsedBody = query.parse(body)
				if (parsedBody.make === '' || parsedBody.model === '' || parsedBody.price === '') {
					res.writeHead(406)
					res.write('You should fill all your fields before submitting the form')
					res.end()
					return true
				}

				if (isNaN(parsedBody.price)) {
					res.writeHead(406)
					res.write('The type of the price field should be Number')
					res.end()
					return true
				}

				//read data from the database and turn it from json into js objects
				let bd = ''
				let readStream = fs.createReadStream('database.json')
				readStream.on('data', (data) => {bd += data})
				readStream.on('end', () => {
					let dt = JSON.parse(bd)
					dt.counter = parseInt(dt.counter)
					parsedBody.id = dt.counter;
					parsedBody.isDeleted = false
					let date = new Date()
					parsedBody.createdOn = date.getTime()
					dt.cars.push(parsedBody)
					dt.counter++;
					let json = JSON.stringify(dt)
					fs.writeFile('database.json', json)

					res.writeHead(200)
					res.write('New Car Add created')
					res.end()
				})


			})
		}
	} else {
		return true
	}
}
