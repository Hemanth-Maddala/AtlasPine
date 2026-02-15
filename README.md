MERN Productivity App (Phase 1)

Stack: Vite + React (frontend), Express + MongoDB (backend)

Setup
- Frontend
  - cd frontend
  - npm install
  - npm run dev

- Backend
  - cd backend
  - Create .env with:
    - PORT=5000
    - MONGODB_URI=mongodb://127.0.0.1:27017/mernauth (or Atlas URI)
    - JWT_SECRET=some_secret
    - CLIENT_URL=http://localhost:5173
  - npm install
  - npm run dev

Endpoints
- Auth: POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me
- Notes: GET/POST /api/notes, PUT/DELETE /api/notes/:id
- Tasks: GET/POST /api/tasks, PUT/DELETE /api/tasks/:id
- Reminders: GET/POST /api/reminders, PUT/DELETE /api/reminders/:id

Dev Notes
- Vite dev proxy forwards /api to http://localhost:5000
- Swap CSS with Tailwind later without changing markup







in reminders we have to give the input for the Note (in schema it was there but not in frontend). 
if reimder sent is false , make sure you provide the border of that respective remainder as golden-yellow, if send the make sure u give border as green (but not exactly green)



## Medical ChatBot
0. pipeLine :-
    1. take the book related to medical
    2. text chunks
    3. create embeddings
    4. Build Semantic Index -> similar items will be in same group (like concentric the similar features acc to esmbedding distance)
1. create an environmennt - conda create 'environment name'
2. Requirements :- 
  ctransformers==0.2.5
  sentense-transformers==2.2.2   (for embeddings)
  pinecone-client   (to store the embeddings)
  Langchain
# model 
Using the Lamma2 model


# DEPLOYMENT
https://atlas-pine.vercel.app/    => frontend in vercel
https://atlaspine-backend.onrender.com     => backend in render
1. VITE_API_URL = https://atlaspine-backend.onrender.com     => this is the environment variable given to vercel so in fetch in frontend we kept  "const API = import.meta.env.VITE_API_URL"  so fetch requests in frontend vercel will triggers VITE_API_URL in render 
2. in VITE the environment variable should be start with "VITE"