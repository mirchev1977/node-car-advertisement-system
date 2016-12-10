let fs = require('fs')
let url = require('url')

module.exports = function (req, res) {
	req.pathName = req.pathName || url.parse(req.url).pathname
	if (req.url === '/') {
		fs.readFile('./index.html', (err, data) => {
			if (err) {console.log(err)}

			res.writeHead(200, {
				'Content-Type': 'text/html'
			})
			res.write(data)
			res.end()
		})
	} else {
		return true
	}
}
