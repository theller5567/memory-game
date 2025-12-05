# Testing Guide for Memory Game with MongoDB

## Prerequisites Check

✅ All dependencies are installed (axios, express, mongoose, cors, dotenv, nodemon)

## Step-by-Step Testing

### 1. Start the Backend Server

Open a terminal and run:

```bash
npm run server:dev
```

**Expected Output:**
```
MongoDB Connected
Server running on port 5000
```

**If you see connection errors:**
- Check your MongoDB connection string in `src/server.js` (line 17)
- Ensure your MongoDB cluster allows connections from your IP
- The server has a fallback connection string, so it should work even without a `.env` file

### 2. Start the Frontend (in a NEW terminal)

```bash
npm run dev
```

**Expected Output:**
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 3. Test the Application

#### Test 1: Basic Game Flow
1. Open `http://localhost:5173/` in your browser
2. Enter your name in the form
3. Select a difficulty level (e.g., "Beginner")
4. Select a category (e.g., "Animals and Nature")
5. Click "Start Game"
6. Play the game and try to match cards

#### Test 2: Save Stats on Win
1. Complete a game successfully (match all cards)
2. Check the browser console (F12) for: `"Game stats saved successfully"`
3. Check the server terminal for any errors

#### Test 3: Save Stats on Loss
1. Start a new game
2. Exceed the flip limit for your difficulty level
3. Check console for: `"Game stats saved successfully"`

#### Test 4: View Leaderboard
1. Click the "View Leaderboard" button
2. You should see:
   - Overall statistics (Total Games, Wins, Win Rate, Avg Flips)
   - A difficulty filter dropdown
   - A table with game records (if any exist)

#### Test 5: Filter Leaderboard
1. In the leaderboard view, change the difficulty filter
2. The table should update to show only that difficulty level

### 4. Test API Endpoints Directly (Optional)

You can test the API endpoints using curl or a tool like Postman:

#### Test Save Stats Endpoint
```bash
curl -X POST http://localhost:5000/api/stats \
  -H "Content-Type: application/json" \
  -d '{
    "username": "TestUser",
    "difficulty": "beginner",
    "flips": 15,
    "won": true
  }'
```

**Expected Response:**
```json
{
  "_id": "...",
  "username": "TestUser",
  "difficulty": "beginner",
  "flips": 15,
  "won": true,
  "date": "2024-...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### Test Leaderboard Endpoint
```bash
curl http://localhost:5000/api/leaderboard
```

#### Test Leaderboard with Difficulty Filter
```bash
curl "http://localhost:5000/api/leaderboard?difficulty=beginner&limit=10"
```

#### Test Overall Stats
```bash
curl http://localhost:5000/api/stats/overall
```

#### Test User Stats
```bash
curl http://localhost:5000/api/stats/user/TestUser
```

## Troubleshooting

### Server won't start
- **Error: "Cannot find module"** → Run `npm install`
- **Error: "Port already in use"** → Change PORT in `.env` or kill the process using port 5000
- **MongoDB connection error** → Check your connection string and network access

### Frontend can't connect to API
- **CORS errors** → Ensure the server is running and CORS is enabled
- **404 errors** → Check that `VITE_API_URL` in frontend matches server port
- **Network errors** → Verify server is running on port 5000

### Stats not saving
- Check browser console for errors
- Check server terminal for errors
- Verify MongoDB connection is successful
- Check that name and difficulty are being passed correctly

### Leaderboard not loading
- Check browser console for API errors
- Verify server is running
- Check network tab in browser DevTools
- Ensure at least one game has been won (leaderboard only shows wins)

## Quick Test Checklist

- [ ] Server starts without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Can start a new game with name, difficulty, and category
- [ ] Game stats save when game is won
- [ ] Game stats save when game is lost
- [ ] Leaderboard button toggles view
- [ ] Leaderboard displays overall stats
- [ ] Leaderboard shows game records
- [ ] Difficulty filter works
- [ ] No console errors in browser
- [ ] No errors in server terminal

## Next Steps After Testing

Once everything works:
1. Create a `.env` file for environment variables
2. Move MongoDB connection string to `.env` (for security)
3. Consider adding error handling UI for failed API calls
4. Add loading states for API requests
5. Consider adding user authentication for better stats tracking

