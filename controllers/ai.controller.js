const { GoogleGenAI } = require('@google/genai');

// We initialize the AI instance. It automatically picks up process.env.GEMINI_API_KEY if available.
const ai = new GoogleGenAI({});

exports.generateDashboardReport = async (req, res) => {
    try {
        const { stats } = req.body;
        
        if (!stats) {
            return res.status(400).send({ message: "Dashboard statistics are required for the AI report." });
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            return res.status(500).send({ message: "GEMINI_API_KEY is missing or invalid. Please configure it in Vercel to use AI features!" });
        }

        const prompt = `
        You are an expert Chief Academic Officer for a university. 
        Analyze the following real-time database statistics from the university's cloud system:
        ${JSON.stringify(stats)}
        
        Write a concise, 1-paragraph Executive Analytics Report focusing on how the school is generally performing based on average marks and department enrollment distribution. Keep it highly professional but easy to read.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.status(200).send({ report: response.text });
    } catch (err) {
        console.error("AI Generation Error:", err);
        res.status(500).send({ message: err.message || "Failed to generate AI report." });
    }
};

exports.generateStudentPlan = async (req, res) => {
    try {
        const { student_name, course_name, department_name, grade, marks } = req.body;

        if (!student_name || marks === undefined) {
             return res.status(400).send({ message: "Student details and marks are required for the Action Plan." });
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            return res.status(500).send({ message: "GEMINI_API_KEY is missing or invalid. Please configure it in Vercel to use AI features!" });
        }

        const prompt = `
        You are a supportive academic advisor. 
        A student named ${student_name} is currently enrolled in ${course_name} (Department: ${department_name}).
        They recently achieved a score of ${marks}/100 (Grade: ${grade}).
        
        Write a hyper-personalized, 3-bullet-point improvement or continuation action plan directly addressed to the student. 
        If their score is high, encourage them and suggest advanced topics. If their score is low, provide constructive, step-by-step study strategies for that generic subject area.
        Keep each bullet strictly to 1 sentence. Do not include any other text besides the 3 bullets.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.status(200).send({ plan: response.text });

    } catch (err) {
        console.error("AI Generation Error:", err);
        res.status(500).send({ message: err.message || "Failed to generate Student Plan." });
    }
};

exports.chatWithData = async (req, res) => {
    try {
        const { question, context } = req.body;

        if (!question) {
             return res.status(400).send({ message: "A question is required." });
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            return res.status(500).send({ message: "GEMINI_API_KEY is missing. Please configure it in Vercel to use the Chatbot!" });
        }

        const prompt = `
        You are a highly intelligent Cloud Management System assistant named "CloudBot".
        Your system administrator is asking you a question about their live database.
        
        Live Database Context (JSON):
        ${JSON.stringify(context || {})}
        
        Admin Question: "${question}"
        
        Answer their question directly based ONLY on the JSON context provided above. 
        Keep your response conversational, extremely concise (2-3 sentences max), and professional. Do not use markdown like bolding or lists, just plain text. If the answer cannot be found in the context, say "I don't have enough data to see that right now."
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.status(200).send({ answer: response.text });

    } catch (err) {
        console.error("AI Chat Error:", err);
        res.status(500).send({ message: err.message || "Failed to process chat." });
    }
};
