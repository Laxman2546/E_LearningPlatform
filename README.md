# 🎓 Study Lane – Interactive Learning with AI Integration  

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tech](https://img.shields.io/badge/Stack-MEEN-green.svg)
![Status](https://img.shields.io/badge/Status-In%20Progress-orange.svg)

## 🚀 Overview  
**Study Lane** is an interactive **AI-powered learning platform** built using the **MEEN stack (MongoDB, Express.js, EJS, Node.js)**.  
It allows students to **learn through videos**, **enroll in courses**, and **solve doubts through community discussions**.  
The platform also integrates **AI-driven career guidance tools** to help students discover personalized learning paths.  

---

## 🧠 Features  

- 🎥 **Interactive Learning** — Watch videos  directly on the platform.  
- 📚 **Course Enrollment Tracking** — Keep track of completed and ongoing courses.  
- 💬 **Community Doubt Solving** — Ask and answer questions with peers.  
- 🤖 **AI Career Guidance** — Get tailored career suggestions based on your learning progress.  
- 🧾 **User Dashboard** — View enrolled courses

---

## 🏗️ Tech Stack  

| Category | Technology |
|-----------|-------------|
| Frontend | EJS Templates  |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| AI Tools | Gemini API  |
| Styling | Tailwind CSS  |
| Authentication | JWT / Passport.js |
| Deployment | Render  |

---

## ⚙️ Installation  

Follow these steps to set up the project locally 👇

```bash
# 1️⃣ Clone the repository
git clone https://github.com/Laxman2546/Study-Lane.git

# 2️⃣ Navigate into the folder
cd Study-Lane

# 3️⃣ Install dependencies
npm install

# 4️⃣ Add environment variables (.env)
MONGO_URI=your_mongodb_connection_string
GEMINI_KEY=your_api_key
PORT=5000

# 5️⃣ Run the server
npx nodemon
