# Reddit Monitor & AI Sentiment Analyzer 🚀

A modern **full-stack web application** that monitors Reddit discussions for configurable keywords (products, competitors, or topics) and uses **AI-powered sentiment analysis** to convert unstructured conversations into actionable insights.

This project demonstrates real-world usage of **web scraping, LLM APIs, data persistence, and dashboard visualization** for market intelligence.

---

## 🛠️ Tech Stack

- **Language:** TypeScript  
- **Framework:** Next.js (React) – frontend + backend API routes  
- **Styling:** Tailwind CSS  
- **Database:** SQLite with Prisma ORM  
- **Web Scraping:** Firecrawl  
- **AI & NLP:** NVIDIA Llama 3 API  
- **Icons:** Lucide Icons  

---

## 🏗️ Architecture & Workflow

1. **User Trigger**  
   The user clicks **“Fetch New Data”** from the dashboard.

2. **Web Scraping (Firecrawl)**  
   Firecrawl crawls Reddit search pages for configured keywords and converts page content into clean text.

3. **AI Processing (NVIDIA Llama 3)**  
   The scraped content is sent to an LLM which:
   - Filters only relevant posts and comments
   - Extracts author and content
   - Classifies sentiment as **Positive** or **Negative**

4. **Data Persistence (SQLite + Prisma)**  
   Processed results are stored in a local SQLite database for fast access and historical analysis.

5. **Dashboard Rendering**  
   Stored insights are displayed as structured cards with sentiment indicators on a clean, responsive UI.

---

## ⭐ Key Features

- **AI-Based Reddit Monitoring**  
  No reliance on the official Reddit API, avoiding rate limits and access restrictions.

- **Sentiment Classification**  
  Automatically tags discussions as positive or negative for quick analysis.

- **Persistent Storage**  
  All processed data is saved locally for fast reloads and reuse.

- **Modern UI**  
  Responsive dashboard built with Tailwind CSS and minimal design principles.

- **Configurable Keywords**  
  Topics, products, or competitors can be monitored without hardcoding sensitive names.

---

## 📂 Project Structure
