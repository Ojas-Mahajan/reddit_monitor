# Reddit Monitor & AI Sentiment Analyzer 🚀

Welcome to the **Reddit Monitor**! This is a simple, modern web application built to automatically search Reddit for specific keywords (like competitors or products), read what people are saying, and use AI to determine if they are happy or angry about them.

---

## 🛠️ Tech Stack (The Tools Used)

This project uses a modern "Full-Stack" approach, meaning both the visual website and the hidden background logic are built together.

*   **Language:** **TypeScript** (A stricter, safer version of JavaScript that helps prevent bugs).
*   **Framework:** **Next.js (React)**. This handles both the Frontend (what you see) and the Backend API (the hidden engine).
*   **Styling:** **Tailwind CSS**. Used to easily make the website look beautiful without writing messy CSS files.
*   **Database:** **SQLite** managed by **Prisma**. SQLite is a simple digital filing cabinet that lives right in this folder (`dev.db`). Prisma is the tool that helps our code talk to that filing cabinet easily.
*   **Scraper:** **Firecrawl**. A tool that can visit any website and turn it into clean text for an AI to read.
*   **AI Brain:** **NVIDIA Llama 3 API**. We send the text Firecrawl found to NVIDIA's supercomputers, and the smart AI reads it to extract only the relevant posts and grades their sentiment.

---

## 🏗️ How it Works (Under the Hood)

Here is a step-by-step, simple explanation of what happens when you use this app:

1.  **The Trigger:** You sit at your computer, open the website, and click the blue **"Fetch New Data"** button.
2.  **The Fetcher (Firecrawl):** Your computer secretly talks to Firecrawl and says, *"Go to Reddit.com and search for 'paddle'. Copy everything you see on the screen."*
3.  **The Brain (NVIDIA AI):** Firecrawl comes back with a massive, messy wall of text. Your computer then hands that messy text to the NVIDIA AI and says, *"Read this. Find only the comments talking about 'paddle'. Tell me who wrote it, what exactly they said, and tell me if they are Positive or Negative."*
4.  **The Filing Cabinet (Database):** The AI hands back a perfectly clean list of comments. Before showing you, your computer saves this clean list into the SQLite Database so it's backed up forever.
5.  **The Screen (Dashboard):** Finally, your computer opens the filing cabinet, grabs all the saved comments, and draws them as beautiful white cards on your screen!

---

## ⭐ Features

*   **Bypass Reddit Rules:** Because we use an AI Scraper (Firecrawl) instead of the official Reddit API, we don't have to worry about Reddit blocking our developer account or setting strict request limits.
*   **AI Sentiment Analysis:** It doesn't just find mentions; it actually reads them and tags them in Green (Positive) or Red (Negative) so you can gauge public opinion at a glance.
*   **Local Storage:** All scraped data is saved to a local `.db` file on your computer, making it incredibly fast to load next time you open the app.
*   **Beautiful UI:** A clean, modern dashboard built with Tailwind CSS and Lucide icons.

---

## 💻 How to Run the Project

Follow these steps to start the application on your computer:

### 1. Prerequisite Checklist
Before starting, ensure you have:
*   Installed **Node.js** on your computer.
*   Placed your secret API keys inside the `.env.local` file (Specifically `FIRECRAWL_API_KEY` and `NVIDIA_API_KEY`).

### 2. Start the Server
1. Open your terminal (or PowerShell).
2. Make sure you are inside the project folder:
   ```bash
   cd "reddit_monitor"
   ```
3. Run the development command:
   ```bash
   npm run dev
   ```

### 3. Open the App!
Once the terminal says "Ready", open your web browser (Chrome, Edge, Safari) and go to:
**`http://localhost:3000`**

(If it says port 3000 is in use, try `http://localhost:3001`).

### 4. Fetch the Data
When the dashboard loads, it might be empty! Click the **"Fetch New Data"** button in the top right corner. Wait about 15-30 seconds for the AI to do its scraping and thinking, and watch the screen fill up with data!
