export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
}
export interface Transaction {
    id: string;
    user_id: string;
    date: string;
    merchant: string;
    amount: number;
    type: 'income' | 'expense';
    category_id: string | null;
    source: string;
    raw?: string;
}
export interface Category {
    id: string;
    user_id: string;
    name: string;
    color?: string;
}
export interface Rule {
    id: string;
    user_id: string;
    priority: number;
    match_type: 'regex' | 'keyword';
    pattern: string;
    category_id: string;
}
export interface Event {
    id: string;
    user_id: string;
    name: string;
    date_from: string;
    date_to: string;
    manuallyExcludedTransactionIds?: string[];
}
export interface EMIDetails {
    amount: number;
    tenure: number;
    interestRate: number;
}
export interface EMIResult {
    monthlyEMI: number;
    totalInterest: number;
    totalAmount: number;
    affordabilitySuggestion?: string;
}
export interface SpendingTipResponse {
    tip: string;
    category?: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
//# sourceMappingURL=index.d.ts.map