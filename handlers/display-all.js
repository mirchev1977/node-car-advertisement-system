let fs = require('fs')
let url = require('url')

module.exports = function (req, res) {
	req.pathName = req.pathName || url.parse(req.url).pathname
	if (req.url === '/all') {
		// let bd = ''
		// let readStream = fs.createReadStream('database.json')
		// readStream.on('data', (data) => {bd += data})
		// readStream.on('end', () => {
		// 	let dt = JSON.parse(bd)
		// 	dt.counter = parseInt(dt.counter)
		// 	parsedBody.id = dt.counter;
		// 	parsedBody.isDeleted = false
		// 	let date = new Date()
		// 	parsedBody.createdOn = date.getTime()
		// 	dt.cars.push(parsedBody)
		// 	dt.counter++;
		// 	let json = JSON.stringify(dt)
		// 	fs.writeFile('database.json', json)

		// 	res.writeHead(200)
		// 	res.write('New Car Add created')
		// 	res.end()
		// })
		console.log('read all')
	} else {
		return true
	}
}
