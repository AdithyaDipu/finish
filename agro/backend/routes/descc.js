const express = require('express');
const router = express.Router();

router.get('/get-user-projects', async (req, res) => {
  const userEmail = req.query.email;
  try {
    const projects = await Project.find({ user_email: userEmail });
    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this email.' });
    }
    res.json({ entries: projects });
  } catch (err) {
    console.error('Error fetching user projects:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
