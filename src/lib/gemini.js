import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("VITE_GEMINI_API_KEY is not defined in your environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const getFinancialAdvice = async (userPrompt, userContext, history = []) => {
  const modelsToTry = [
    "gemini-2.5-flash", 
    "gemini-2.0-flash", 
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash-lite"
  ];

  let lastError;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: `
          You are Penny, a helpful and friendly personal finance assistant for the PennyWings app.
          Your personality is punchy, positive, and premium.
          
          User Information:
          - Name: ${userContext.userName || 'Friend'}
          
          Here is the user's current financial context:
          - Total Balance: ₱${userContext.totalBalance || 0}
          - Monthly Expenses: ₱${userContext.monthlyExpenses || 0}
          - Monthly Income: ₱${userContext.monthlyIncome || 0}
          - Top Category: ${userContext.topExpenseCategory || 'N/A'}
          - Overall Budget Status: ${userContext.budgetProgress || 'N/A'}
          
          Specific Account Balances:
          ${userContext.accountBalances || 'None'}
  
          Active Budgets:
          ${userContext.detailedBudgets || 'None'}
          
          Recent Transactions (up to 10):
          ${userContext.recentTransactions || 'None'}
          
          Rules:
          1. Answer concisely and positively.
          2. Use "₱" for currency.
          3. Address the user by their name ("${userContext.userName || 'Friend'}") when appropriate to feel personal.
          4. Base your advice on the user's specific accounts, budgets, and recent transactions provided above.
          5. Focus on explaining the user's data (using the specific category names provided) and giving helpful budgeting tips.
          6. If you notice a user has a budget for a category (like "Shopping"), refer to it by name.
          7. If you don't have enough data to answer a specific query, ask the user for clarification.
        `
      });

      // Format history for the SDK ensuring alternating roles
      // systemInstruction handles the initial context now
      const contents = [
        ...history,
        {
          role: "user",
          parts: [{ text: userPrompt }]
        }
      ];

      const result = await model.generateContent({ contents });
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.warn(`Model ${modelName} failed:`, error.message);
      lastError = error;
      
      // Keep trying the next model
      continue;
    }
  }
  
  // Handle specific API errors from the last attempt
  if (lastError && (lastError.status === 429 || lastError.message.includes('429') || lastError.message.includes('quota'))) {
    throw new Error("Penny is taking a quick break! I've been answering too many questions lately. Please try again in about a minute.");
  }
  
  throw new Error("Sorry, I'm having trouble connecting to my brain right now. Please try again later!");
};
