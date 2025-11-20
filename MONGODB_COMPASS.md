# Connecting to MongoDB Compass

## Quick Connection

1. Open **MongoDB Compass**
2. Use this connection string:
   ```
   mongodb://localhost:27017
   ```
3. Click **Connect**

## Database Details

- **Database Name:** `lms`
- **Server:** `localhost:27017`

## Collections in the `lms` Database

Once connected, you'll see these collections:

1. **students** - All registered users (students, instructors, admins)
2. **courses** - All created courses
3. **enrollments** - Student course enrollments
4. **quizzes** - Quiz data
5. **notifications** - User notifications

## Viewing Data

After connecting:
1. Click on the **`lms`** database in the left sidebar
2. Click on any collection (e.g., `students`)
3. You'll see all documents stored in that collection
4. You can browse, filter, and edit data directly in Compass

## Notes

- Make sure MongoDB is running locally before connecting
- All data is stored in the `lms` database
- You can query, update, and delete data directly from Compass

