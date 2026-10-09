# Sahayak.AI: Your AI Co-Teacher

**Live Demo:** [Link to your deployed app] &nbsp;&nbsp;&nbsp; **Portfolio:** [Link to your portfolio]

---

## 1. Project Summary

**Sahayak.AI** is a full-stack, AI-powered web application designed to act as a co-teacher, empowering educators by automating and enhancing classroom activities. Accessed through a simple, voice-first interface, Sahayak.AI drastically reduces teacher workload by generating hyperlocal teaching content, differentiated learning materials, visual aids, and lesson plans. The project demonstrates the power of modern generative AI (Google's Gemini models) integrated into a responsive and intuitive user experience built with Next.js and React.

## 2. The Problem: The Teacher's Time Crunch

In today's diverse classrooms, teachers are stretched thinner than ever. They face immense pressure to deliver personalized education while being buried under a mountain of administrative work. Countless hours are spent on repetitive but essential tasks: creating lesson plans, finding culturally relevant teaching materials, and adapting assignments for students with different learning paces. This administrative burden directly impacts educational quality, stealing precious time that could be spent on one-on-one student interaction and creative instruction.

## 3. Our Solution: An AI-Powered Partner

**Sahayak.AI** is an intelligent, AI-powered web application designed to act as a dedicated co-teacher. Our solution directly tackles the administrative overload by automating the most time-consuming preparatory tasks. Through a simple, intuitive, and voice-enabled interface, Sahayak.AI empowers educators to reclaim their time and focus on what truly matters: teaching. It's not just a collection of tools; it's a tireless, responsive partner that understands the dynamic needs of a modern classroom.

---

## 4. Key Features

This project showcases a suite of powerful, AI-driven tools:

*   **Hyperlocal Content Generator:** Creates culturally relevant stories in various local languages from a simple voice or text prompt.
*   **Differentiated Worksheet Generator:** A teacher can upload a photo of a textbook page, and the AI generates three tiered worksheets (easy, intermediate, advanced) based on the content.
*   **Knowledge Assistant:** A real-time conversational AI that answers student questions with simple, age-appropriate explanations and analogies, complete with text-to-speech audio.
*   **Visual Aid Generator:** Generates high-quality, blackboard-friendly images and sketches from text prompts to help explain concepts visually.
*   **"Ask Later" Asynchronous Queue:** Enables teachers to capture student questions during class and receive comprehensive, multi-modal answers (text, image, and audio) later.
*   **Auto Lesson Planner:** Generates a structured, level-wise lesson plan from a weekly syllabus provided by the teacher.
*   **Role-Play Script Creator:** Creates educational role-play scripts, complete with multi-speaker audio, to facilitate interactive classroom activities.
*   **Learning Games Arcade:** A suite of interactive games (Math Quiz, Word Scramble, Memory Match) with adaptive difficulty to make learning fun and engaging.

---

## 5. Technology Stack & Architecture

Sahayak.AI is built on a modern, robust, and scalable technology stack, demonstrating expertise in full-stack development and AI integration. For a detailed diagram and data flow, please see the [**Architecture Overview**](./ARCHITECTURE.md).

*   **Frontend:**
    *   **Next.js & React:** Utilized the App Router for server-rendered pages, ensuring optimal performance and a fast user experience.
    *   **TypeScript:** Ensured type safety and maintainability across the project.
    *   **Tailwind CSS & ShadCN UI:** Created a professional, responsive, and accessible user interface with a modern design system.

*   **Backend & AI Integration:**
    *   **Firebase Genkit:** Orchestrated all backend AI logic. Genkit was used to define complex, multi-step "flows" that chain together calls to various AI models.
    *   **Google AI (Gemini Models):**
        *   **Gemini 1.5 Flash:** For all text generation, summarization, and conversational AI tasks.
        *   **Gemini Pro Vision:** To analyze the content of uploaded textbook images.
        *   **Gemini Image & Audio Models:** For generating visual aids, illustrations for stories, and text-to-speech functionality.

*   **Deployment:**
    *   **Vercel:** The application is hosted on Vercel, which provides a seamless environment for deploying Next.js applications, including serverless functions for the backend logic.

---

## 6. How to Run This Project Locally

This guide provides step-by-step instructions to get the Sahayak.AI application running on your computer.

### Step 1: Prerequisites

*   **Node.js:** This project requires Node.js. If you don't have it installed, please download and install the **LTS (Long-Term Support)** version from the official [Node.js website](https://nodejs.org/). Installing Node.js will also automatically install `npm`, which is the package manager we need.
*   **Git:** You will need Git to clone the repository. You can download it from the [Git website](https://git-scm.com/downloads).

### Step 2: Get Your Gemini API Key

The AI features in this app are powered by Google's Gemini models. To use them, you will need a free API key.

1.  Visit the **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
2.  Click the **"Create API key in new project"** button.
3.  A new API key will be generated for you. **Copy this key** to your clipboard.

### Step 3: Clone and Run the App

1.  **Open Your Terminal:** Open a terminal or command prompt on your computer.

2.  **Clone the Repository:** Run the following command to download the project files. Replace `YOUR_REPOSITORY_URL` with the actual URL of the GitHub repository.
    ```bash
    git clone YOUR_REPOSITORY_URL
    ```

3.  **Navigate to Project Directory:**
    ```bash
    cd sahayak-ai # Or your repository's folder name
    ```

4.  **Create the Environment File:** In the project's root directory, create a new file and name it exactly **`.env.local`**.

5.  **Add Your API Key:** Inside the `.env.local` file, add the following line. Replace `YOUR_API_KEY_HERE` with the actual API key you copied from the Google AI Studio.
    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

6.  **Install Dependencies:** In the terminal, run the following command. This will read the `package.json` file and install all the required libraries.
    ```bash
    npm install
    ```

7.  **Run the Development Server:** Once the installation is complete, start the application by running:
    ```bash
    npm run dev
    ```

8.  **View the Application:** You will see a message in the terminal indicating that the server has started, usually on port 3000. Open your web browser and navigate to:
    > **http://localhost:3000**

You should now see the Sahayak.AI application running locally! To stop the server, go back to your terminal and press `Ctrl + C`.

---
## 7. Development Process: An AI Collaboration

This project was developed by directing an AI coding partner (Google's Project IDX). This innovative, collaborative approach involved:
1.  **High-Level Direction:** Defining the project concept, core features, and user experience.
2.  **Iterative Prompting:** Translating requirements into specific, actionable prompts for the AI to generate code.
3.  **Real-time Review & Refinement:** Testing the generated features, identifying issues (like bugs, responsiveness problems, or usability gaps), and providing corrective feedback to the AI for immediate iteration.

This methodology demonstrates a modern workflow, focusing human creativity on architecture and user-centric design while leveraging AI for efficient, high-quality code implementation.
