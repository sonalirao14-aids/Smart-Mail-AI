# Smart-Mail-AI
AI-powered SmartMail Assistant that analyzes emails, extracts key information, generates replies, and automates actions like scheduling and notifications using n8n and agentic workflows.


🚀 SmartMail AI
SmartMail AI is an automation system that analyzes incoming emails using AI and automatically performs actions like extracting intent, generating replies, and creating Google Calendar events.

🧠 Features

    📩 Accepts email input via webhook

    🤖 Uses AI to:

        Detect intent (meeting, task, reminder, etc.)

        Extract key details (date, time, action)

        Generate a smart reply

    📅 Automatically creates Google Calendar events

    ⚡ Built using no-code automation (n8n)


🏗️ Architecture

    Frontend (optional UI / input)

        ↓
        
    Backend (API / webhook trigger)

        ↓
        
    n8n Workflow

        → Webhook
   
       → AI Processing (OpenRouter / OpenAI)
   
       → Data Formatting
   
       → Google Calendar Integration

   
⚙️ Tech Stack

    n8n (workflow automation)

    OpenRouter / OpenAI API (AI processing)

    Google Calendar API

    Thunder Client / Postman (testing)

    Frontend (React / HTML)
