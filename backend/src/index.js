// const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const dotenv = require('dotenv');
// const connectDb = require('./lib/db');

// const cron = require("node-cron");
// const nodemailer = require("nodemailer");
// const Reminder = require("./models/Reminder");
// const user = require('./models/User');


// dotenv.config();

// const app = express();


// // Email sender setup
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASSWORD
//   }
// });

// // Cron job: run every minute
// cron.schedule("* * * * *", async () => {
//   const now = new Date();
//   const dueReminders = await Reminder.find({
//     remindAt: { $lte: now },
//     sent: false
//   }).populate("user");

//   for (const reminder of dueReminders) {
//     // Send email
//     await transporter.sendMail({
//       from: process.env.EMAIL,
//       to: reminder.user.email,
//       subject: `Reminder: ${reminder.title}`,
//       text: reminder.note || "Don't forget!"
//     });
//     console.log(`Sent reminder to ${reminder.user.email} for "${reminder.title}"`);

//     // Mark as sent
//     reminder.sent = true;
//     await reminder.save();
//   }
// });

// // Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({
//   origin: ["http://localhost:5173", "http://localhost:8000"],
//   credentials: true
// }));

// // Health
// app.get('/api/health', (req, res) => {
//   res.json({ ok: true, service: 'backend', timestamp: Date.now() });
// });

// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/notes', require('./routes/noteRoutes'));
// app.use('/api/tasks', require('./routes/taskRoutes'));
// app.use('/api/reminders', require('./routes/reminderRoutes'));
// app.use("/api", require("./routes/pdfQA"));
// app.use('/api/medical', require('./routes/medical'));

// // Start
// const PORT = process.env.PORT || 5000;
// connectDb()
//   .then(() => {
//     app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
//   })
//   .catch((err) => {
//     console.error('Failed to start server', err);
//     process.exit(1);
//   });

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDb = require('./lib/db');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Reminder = require('./models/Reminder');

dotenv.config();
const app = express();

app.use(cors({
  origin: ["http://localhost:5173"], // all frontend origins
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Auth routes first (login/register)
app.use('/api/auth', require('./routes/authRoutes'));

// Then PDF routes
app.use("/api", require("./routes/pdfQA"));

// Then other protected routes
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/medical', require('./routes/medical'));
app.use('/api/summarize_video', require('./routes/video'));


// 7️⃣ Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'backend', timestamp: Date.now() });
});

// 8️⃣ Nodemailer + cron
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL, pass: process.env.PASSWORD }
});

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const dueReminders = await Reminder.find({ remindAt: { $lte: now }, sent: false }).populate("user");
  for (const r of dueReminders) {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: r.user.email,
      subject: `Reminder: ${r.title}`,
      text: r.note || "Don't forget!"
    });
    r.sent = true;
    await r.save();
    console.log(`Sent reminder to ${r.user.email} for "${r.title}"`);
  }
});

// 9️⃣ Start server
const PORT = process.env.PORT || 5000;
connectDb()
  .then(() => app.listen(PORT, () => console.log(`✅ API listening on port ${PORT}`)))
  .catch(err => {
    console.error('❌ Failed to start server', err);
    process.exit(1);
  });

