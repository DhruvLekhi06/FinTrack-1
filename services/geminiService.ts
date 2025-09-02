import type { Account, Debt, SIP, FixedDeposit, Stock, Goal, Transaction, Budget } from '../types';

export interface FinancialData {
    transactions: Transaction[];
    debts: Debt[];
    goals: Goal[];
    sips: SIP[];
    fds: FixedDeposit[];
    stocks: Stock[];
    accounts: Account[];
    budgets: Budget[];
}

interface Message {
    role: 'user' | 'model';
    content: string;
}

export const getFinancialAdvice = async (history: Message[]): Promise<string> => {
    try {
        const response = await fetch('/.netlify/functions/get-advice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ history }),
        });

        if (!response.ok) {
            // Attempt to parse the error response as JSON, but fall back gracefully.
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.error || `Server Error: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const result = await response.json();
        if (!result.advice) {
            throw new Error("Received an empty advice from the server.");
        }
        return result.advice;
    } catch (error: any) {
        console.error("Error fetching financial advice from backend:", error);
        // Provide a more user-friendly message for common network errors.
        if (error instanceof TypeError && error.message.includes('fetch')) {
             throw new Error('Network error: Could not connect to the AI service. Please check your internet connection.');
        }
        throw new Error(error.message || "An unknown error occurred while fetching financial advice.");
    }
};