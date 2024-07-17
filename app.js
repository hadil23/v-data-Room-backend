const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./Routers/userRoutes');
const fileRoutes = require('./Routers/fileRoutes');
const cors = require('cors'); 
const pdfRoutes = require('./Routers/pdfRoutes');
const invitationRoutes = require('./Routers/invitationRoutes');
const panelRoutes =  require('./Routers/panelRouter');
const virtualDataRoomRoutes =  require('./Routers/VirtualDataRoomRoutes');
const authRoutes = require('./Routers/authRoutes');
const app = express();
const port = 3000;

app.use(cors())

app.use(express.json());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/panel',panelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/virtualDataRooms',virtualDataRoomRoutes)

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
