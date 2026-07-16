# AI Evaluation Platform

A complete production-ready AI Evaluation Platform built for Milestone 2. This platform evaluates AI-generated answers using three independent AI Judge Agents powered by the Groq API (`llama-3.3-70b-versatile`).

## 🌟 Features
- **Relevance Judge**: Scores how relevant the response is to the question.
- **Accuracy Judge**: Compares the AI response against a Reference Answer or Retrieved RAG Context.
- **Hallucination Detection Judge**: Extracts every factual statement and checks it against the supplied RAG context.
- **Modern Dashboard**: A dark-mode, glassmorphic React interface to view scores, reasoning, evidence, and hallucinated claims.
- **Benchmark Validator**: Batch-process TruthfulQA and SQuAD samples and generate average metric CSV reports.

## 📸 Screenshots

![Dashboard Screenshot Placeholder](/path/to/screenshot1.png)
*Evaluation Dashboard showing overall summary and individual judge scores.*

![Analysis Details Placeholder](/path/to/screenshot2.png)
*Detailed analysis cards and hallucinated claims table.*

---

## 📂 Folder Structure

```text
llm-evaluation-system/
├── backend/
│   ├── agents/            # AI Judges (Relevance, Accuracy, Hallucination)
│   ├── routers/           # FastAPI routes
│   ├── services/          # Groq API and Prompt configurations
│   ├── utils/             # JSON Parser, Logging
│   ├── validator/         # Benchmark runner
│   ├── app.py             # FastAPI entry point
│   ├── config.py          # Environment settings loader
│   ├── requirements.txt   # Python dependencies
│   └── .env               # Secrets (Groq API Key)
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable React UI components
│   │   ├── pages/         # React pages (Home)
│   │   ├── services/      # Axios API calls
│   │   ├── App.jsx        # React Router setup
│   │   └── main.jsx       # Vite mount point
│   ├── package.json       # Node dependencies
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── vite.config.js     # Vite configuration
└── docs/                  # Documentation
```

## 🚀 Installation & Setup

### 1. Groq API Setup & Environment Variables
First, you need a Groq API key to power the judge agents.
1. Sign up/Log in at [GroqCloud](https://console.groq.com).
2. Generate an API Key.
3. In the `backend/` directory, the `.env` file should contain your key:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 2. Backend Setup
The backend is built with FastAPI and Python.
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. (Optional but recommended) Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI application:
   ```bash
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```
   The backend will be available at `http://localhost:8000`.

### 3. Frontend Setup
The frontend is built with React (Vite) and Tailwind CSS.
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

---

## 🧪 Testing and Benchmark Validation
To evaluate an entire dataset of samples (e.g., TruthfulQA or SQuAD) programmatically:

1. Navigate to the backend directory.
2. The benchmark logic is located in `validator/benchmark_runner.py`.
3. You can execute it directly to run the internal example test:
   ```bash
   python validator/benchmark_runner.py
   ```
4. It will output a CSV file (`backend/test_benchmark_report.csv`) containing individual sample results and overall averages.

---
