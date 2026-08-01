export interface PasswordStrengthResult {
    score: number; // 0-100
    label: 'very weak' | 'weak' | 'fair' | 'good' | 'strong';
    suggestions: string[];
}

/**
 * Scores a password's strength heuristically - length plus character-class
 * diversity (lowercase/uppercase/digit/symbol) - with a small penalty for
 * runs of the same repeated character. This is a UX strength meter for
 * giving users feedback while they type, not a security guarantee: it does
 * not check against breached-password lists or dictionary words.
 */
const passwordStrength = (password: string): PasswordStrengthResult => {
    const suggestions: string[] = [];

    if (!password) {
        return { score: 0, label: 'very weak', suggestions: ['Enter a password.'] };
    }

    let score = 0;

    // Length: up to 40 points, maxed out at 20 characters
    score += Math.min(password.length / 20, 1) * 40;
    if (password.length < 8) {
        suggestions.push('Use at least 8 characters.');
    } else if (password.length < 12) {
        suggestions.push('Consider using 12+ characters for a stronger password.');
    }

    // Character-class diversity: 15 points each, up to 60
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);

    if (hasLower) score += 15; else suggestions.push('Add a lowercase letter.');
    if (hasUpper) score += 15; else suggestions.push('Add an uppercase letter.');
    if (hasDigit) score += 15; else suggestions.push('Add a number.');
    if (hasSymbol) score += 15; else suggestions.push('Add a symbol (e.g. !@#$%).');

    // Penalize runs of the same character repeated 3+ times
    if (/(.)\1{2,}/.test(password)) {
        score -= 10;
        suggestions.push('Avoid repeating the same character multiple times in a row.');
    }

    score = Math.max(0, Math.min(100, Math.round(score)));

    let label: PasswordStrengthResult['label'];
    if (score < 20) label = 'very weak';
    else if (score < 40) label = 'weak';
    else if (score < 60) label = 'fair';
    else if (score < 80) label = 'good';
    else label = 'strong';

    return { score, label, suggestions };
};

export default passwordStrength;