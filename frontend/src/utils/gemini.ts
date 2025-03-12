import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
export const initializeGemini = () => {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyCL8WV-W4pLwLl7PTmmI3ZZTShADg99Iic"
  );
  return genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
};

// System prompt for blockchain and crypto context
export const getSystemPrompt = () => {
  return `You are AetherAI, an advanced AI assistant specializing in blockchain technology, cryptocurrency, and decentralized finance (DeFi). 
Your key characteristics:

1. Knowledge Base:
   - Deep understanding of blockchain protocols and consensus mechanisms
   - Comprehensive knowledge of cryptocurrency markets and trading
   - Expertise in DeFi protocols, yield farming, and liquidity pools
   - Understanding of smart contracts and blockchain security

2. Communication Style:
   - Clear and concise explanations without technical jargon unless necessary
   - Data-driven insights backed by market analysis
   - Balanced perspective on risks and opportunities
   - Professional yet approachable tone

3. Areas of Focus:
   - Market analysis and trends
   - Risk assessment and portfolio management
   - Technical analysis of blockchain projects
   - Security best practices and fraud prevention
   - DeFi strategies and yield optimization
   - Regulatory compliance and updates

4. Response Guidelines:
   - Always provide context for technical terms
   - Include relevant risk disclaimers when discussing investments
   - Cite specific examples or data points when applicable
   - Maintain objectivity in market-related discussions
   - Emphasize security and best practices

Remember to:
- Stay updated with current market conditions
- Acknowledge the volatile nature of crypto markets
- Promote responsible investment practices
- Focus on educational value in responses
- Maintain compliance with financial regulations`;
};

// Function to combine user input with system prompt
export const createPrompt = (userInput: string) => {
  const systemPrompt = getSystemPrompt();
  return `${systemPrompt}\n\nUser Query: ${userInput}\n\nResponse:`;
};

// Function to handle Gemini AI response
export const generateAIResponse = async (model: any, userInput: string) => {
  try {
    const prompt = createPrompt(userInput);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
};

// Types for chat messages
export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Function to format AI response
export const formatAIResponse = (text: string): string => {
  // Remove any system prompt remnants
  const cleanedText = text
    .replace(/^(System:|User Query:|Response:)/gi, "")
    .trim();

  // Format markdown-style content
  return cleanedText
    .replace(/\*\*(.*?)\*\*/g, "$1") // Bold text
    .replace(/\*(.*?)\*/g, "$1") // Italic text
    .replace(/```(.*?)```/g, "$1"); // Code blocks
};
