const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');


const userRoutes = require('./Routers/userRoutes');
const fileRoutes = require('./Routers/fileRoutes');
const pdfRoutes = require('./Routers/pdfRoutes');
const invitationRoutes = require('./Routers/invitationRoutes');
const panelRoutes =  require('./Routers/panelRouter');
const virtualDataRoomRoutes =  require('./Routers/VirtualDataRoomRoutes');
const authRoutes = require('./Routers/authRoutes');
const chatbotRoutes = require('./Routers/chatbotRoutes'); // Corrigé ici

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));



app.use(cors({
    origin: 'http://localhost:4200', // Assurez-vous que l'origine correspond à l'URL de votre frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/panel', panelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/virtualDataRooms', virtualDataRoomRoutes);
app.use('/api/chatbot', chatbotRoutes); // Utilisez un chemin spécifique ici
app.use ('/api' , panelRoutes);
app.listen(port, () => {
    
    
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
