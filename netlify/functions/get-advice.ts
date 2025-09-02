// Copied types to avoid path resolution issues in the serverless environment
export type TransactionType = 'income' | 'expense';
export interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: TransactionType;
}
export type DebtType = 'Credit Card' | 'Personal Loan' | 'Mortgage' | 'Other';
export interface Debt {
  id: string;
  name: string;
  type: DebtType;
  totalAmount: number;
  amountPaid: number;
  interestRate: number;
}
export interface SIP {
  id: string;
  fundName: string;
  monthlyAmount: number;
  startDate: string;
}
export interface FixedDeposit {
  id: string;
  bankName: string;
  principal: number;
  interestRate: number;
  maturityDate: string;
}
export interface Stock {
  id: string;
  ticker: string;
  companyName: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
}
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}
export type AccountType = 'Savings' | 'Checking' | 'Credit Card';
export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
}
export interface Budget {
  id: string;
  category: string;
  limit: number;
}

interface Message {
    role: 'user' | 'model';
    content: string;
}

// Simplified type for the Gemini REST API response
interface GeminiResponse {
    candidates: Array<{
        content: {
            parts: Array<{
                text: string;
            }>;
        };
    }>;
}

const handler = async (event: any) => {
    if (event.httpMethod !== 'POST' || !event.body) {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "API key is not configured on the server." }),
        };
    }

    try {
        const { history } = JSON.parse(event.body) as { history: Message[] };
        const model = 'gemini-2.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const systemInstruction = "You are a helpful and professional financial analyst for users in India. Your analysis and answers must be based *only* on the user's financial data and the conversation history provided. Do not make up information. For the first turn, provide a detailed, structured analysis as requested. For follow-up questions, provide concise and relevant answers. Format your responses clearly using markdown.";
    
        // The function is now a pure proxy. It forwards the history provided by the client.
        const contents = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        }));

        const apiResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: contents,
                systemInstruction: { parts: [{ text: systemInstruction }] }
            }),
        });


        if (!apiResponse.ok) {
            const errorBody = await apiResponse.text();
            console.error("Gemini API Error:", errorBody);
            throw new Error(`Gemini API responded with status: ${apiResponse.status}`);
        }

        const responseData: GeminiResponse = await apiResponse.json();
        const adviceText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (adviceText === undefined) {
             throw new Error("No content received from Gemini API.");
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ advice: adviceText.trim() }),
        };
    } catch (error: any) {
        console.error("Error in Netlify function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || "Failed to get financial advice from the AI service." }),
        };
    }
};

export { handler };