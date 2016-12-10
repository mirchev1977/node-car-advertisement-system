let http = require('http')
let fs = require('fs')

let handlers = require('./handlers/index')

const port = 9000

http
.createServer((req, res) => {
	for(let handler of handlers){
		let next = handler(req, res)
		if(!next){
			break
		}
	}
})

.listen(port)

console.log(`Server listening on port ${port}`)
