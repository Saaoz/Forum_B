const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Bonjour le monde !');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
