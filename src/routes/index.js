const express = require('express');

function buildIndexRouter(socketIOServer) {
    const router = express.Router();

    router.get('/', (req, res) => {
        res.send('Sending Broadcast Message...');
        console.info('foo', 'bar');
        socketIOServer.emit('birds', {
            'foo': 'bar'
        });
    });

    return router;
}


module.exports = buildIndexRouter;