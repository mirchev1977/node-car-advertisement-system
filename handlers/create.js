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
				console.log(parsedBody)
			})
		}
	} else {
		return true
	}
}
