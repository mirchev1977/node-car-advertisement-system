let fs = require('fs')
let url = require('url')

module.exports = function (req, res) {
	req.pathName = req.pathName || url.parse(req.url).pathName
	if (req.url === '/favicon.ico') {
		fs.readFile('./favicon.ico', (err, data) =>{
			if (err) {console.log(err)}

			res.writeHead(200, {
				'Content-Type': 'image/x-icon'
			})
			res.write(data)
			res.end()
		})
	} else {
		return true
	}
}