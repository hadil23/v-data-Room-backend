const pool = require('./connection'); // Adjust the path to where your connection file is located

const panels = [
  { title: 'Legal Documents' },
  { title: 'Financial Documents' },
  { title: 'Products' },
  { title: 'Intellectual Property' }
];

async function addStaticPanelsToVDR(vdrId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    for (const panel of panels) {
      await connection.query('INSERT INTO panels (vdr_id, title) VALUES (?, ?)', [vdrId, panel.title]);
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error('Error adding panels:', error);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = addStaticPanelsToVDR;
