/**
 * Serveur API InspecteurBot — Module PV.
 * @module server
 */
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/pv', require('./routes/pv.routes'));
app.use('/api/infractions', require('./routes/infractions.routes'));
app.use('/api/stats', require('./routes/stats.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`InspecteurBot API sur le port ${PORT}`));
