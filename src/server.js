const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('src'));
app.use(express.json());

app.post('/getAvatar', async (req, res) => {
    const { username } = req.body;

    try {
        // Step 1: Get userId by username
        const userResponse = await axios.get(`https://users.roblox.com/v1/usernames/users`, {
            params: { usernames: [username] }
        });

        if (userResponse.data.data.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userId = userResponse.data.data[0].id;

        // Step 2: Fetch avatar thumbnail URL
        const thumbnailResponse = await axios.get(`https://www.roblox.com/avatar-thumbnails?params=[{"userId":${userId}}]`);

        if (thumbnailResponse.data.length === 0) {
            return res.status(404).json({ message: 'Thumbnail not found' });
        }

        const thumbnailUrl = thumbnailResponse.data[0].thumbnailUrl;
        res.json({ thumbnailUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
