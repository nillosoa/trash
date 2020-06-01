
//	Server Side Events(SSE) + some
//	modifications implemented with express.js

const events = require('events');

const Events = new events
					.EventEmitter();

Events.setMaxListeners(0);

module.exports.send = function(event, data, id=null) {
	data = JSON
			.stringify(data);
	event = event || '';

	if ( id ) {
		Events.emit(
			`targeted-${id}`, { data, event });
	} else {
		Events.emit('public', { data, event });
	}
};

module.exports.setup = function(app) {
	
	app.get('/stream', function (req, res) {
			var id = 0;
			const targeted = req.user ?
								req.user.id ?
								`targeted-${req.user.id}` : null : null;

			req.socket.setTimeout(0);
		    req.socket.setNoDelay(true);
		    req.socket.setKeepAlive(true);
		    res.statusCode = 200;

		    res.setHeader('Content-Type', 'text/event-stream');
		    res.setHeader('Cache-Control', 'no-cache');
		    res.setHeader('X-Accel-Buffering', 'no');

		    if (req.httpVersion !== '2.0') {
		    	res.setHeader('Connection', 'keep-alive');
		    }

		    const sendEventHandler = data => {
		    	res.write(`id: ${id}\n`);
		    	res.write(`event: ${data.event}\n`);
		    	res.write(`data: ${data.data}\n`);
		    	res.write('\n\n');
		    	id ++;
		    };

		    Events.on('public', sendEventHandler)
		    Events.on(targeted, sendEventHandler)

		    req.on('close', () => {
		    	Events.removeListener('public', sendEventHandler);
		    	if (targeted) 
					Events.removeListener(targeted, sendEventHandler); });
		});
};
