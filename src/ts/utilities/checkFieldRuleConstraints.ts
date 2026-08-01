import FieldRuleInterface from "../interfaces/FieldRuleInterface";

/**
 * Checks a value against a field rule's minLength/maxLength/pattern, if any
 * are set. These have no HTML-attribute equivalent in this library, so
 * they're purely config-driven (via NFSFU234FormValidation.configureForms()).
 * Returns undefined if the rule is satisfied (or there's no rule at all).
 */
const checkFieldRuleConstraints = (value: string, rule?: FieldRuleInterface): string | undefined => {
    if (!rule) return undefined;

    if (rule.minLength !== undefined && value.length < rule.minLength) {
        return rule.message ?? `This field must be at least ${rule.minLength} characters.`;
    }
    if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        return rule.message ?? `This field must be no more than ${rule.maxLength} characters.`;
    }
    if (rule.pattern && !(new RegExp(rule.pattern)).test(value)) {
        return rule.message ?? `This field does not match the required format.`;
    }
    return undefined;
};

export default checkFieldRuleConstraints;
