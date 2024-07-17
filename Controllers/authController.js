const sendVerificationCode = require('../utils/sendVerificationCode');

exports.verifyEmail = async (req, res) => {
  const { email, virtualDataRoomId } = req.body;

  if (!email || !virtualDataRoomId) {
    return res.status(400).json({ error: 'Email and virtualDataRoomId are required' });
  }

  // Log the received email and virtualDataRoomId
  console.log('Received email:', email);
  console.log('Received virtualDataRoomId:', virtualDataRoomId);

  // Génération d'un code de vérification aléatoire
  const code = Math.floor(100000 + Math.random() * 900000);

  try {
    // Envoi du code de vérification par email
    await sendVerificationCode(email, code, virtualDataRoomId);
    res.status(200).json({ success: true, message: 'Verification code sent' });
  } catch (error) {
    console.error('Error in verifyEmail:', error);
    res.status(500).json({ success: false, message: 'Could not send verification code.' });
  }
};
