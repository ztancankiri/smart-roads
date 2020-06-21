const path = require('path');
const db = require(path.join(process.cwd(), 'db'));

const route = path.join(process.env.BASE_ROUTE, path.basename(__filename).replace(path.extname(__filename), ''));

module.exports = server => {
    server.get(path.join(route, ':lat/:lng'), async (req, res) => {
        res.contentType = 'application/json';
        const lat = req.params.lat;
        const lng = req.params.lng;
        try {
            const data = await db.query(`
            SELECT * 
            FROM road
            WHERE SQRT (POWER(road_lat - $1, 2) + POWER(road_lng - $2, 2)) < 10`,
                [lat, lng]
            );

            if (data.rows.length == 0) {
                res.send({ success: false, error: 'Empty!' });
                return;
            }

            res.send({ success: true, data: data.rows });
        }
        catch (error) {
            console.error(error.stack || error);
            res.send({ success: false, error: error });
        }
    });
};