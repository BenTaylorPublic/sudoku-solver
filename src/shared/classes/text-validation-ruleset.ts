export type TextValidationRuleFunction = (input: string) => string | null;

export class TextValidationRuleset {
    private rules: TextValidationRuleFunction[] = [];

    constructor(rules: TextValidationRuleFunction[]) {
        this.rules = rules;
    }

    public static minLength(minLengthAmount: number): TextValidationRuleFunction {
        return (input: string): string | null => {
            if (input.length < minLengthAmount) {
                return `Min length of ${minLengthAmount}`;
            }
            return null;
        };
    }

    public static maxLength(maxLengthAmount: number): TextValidationRuleFunction {
        return (input: string): string | null => {
            if (input.length > maxLengthAmount) {
                return `Max length of ${maxLengthAmount}`;
            }
            return null;
        };
    }

    public static notEmpty(): TextValidationRuleFunction {
        return (input: string): string | null => {
            if (input.length === 0) {
                return `Can't be empty`;
            }
            return null;
        };
    }

    public static contains(containsArray: string[]): TextValidationRuleFunction {
        return (input: string): string | null => {
            for (let i: number = 0; i < containsArray.length; i++) {
                if (input.includes(containsArray[i])) {
                    return null;
                }
            }
            let result: string = "Must contain one of ['";
            result += containsArray[0];
            for (let i: number = 1; i < containsArray.length; i++) {

                result += "', '" + containsArray[i];
            }
            result += "']";

            return result;
        };
    }

    public static startsWith(startsWithArray: string[]): TextValidationRuleFunction {
        return (input: string): string | null => {
            for (let i: number = 0; i < startsWithArray.length; i++) {
                if (input.indexOf(startsWithArray[i]) === 0) {
                    return null;
                }
            }
            let result: string = "Must start with one of ['";
            result += startsWithArray[0];
            for (let i: number = 1; i < startsWithArray.length; i++) {

                result += "', '" + startsWithArray[i];
            }
            result += "']";

            return result;
        };
    }

    public static onlyLowercase(): TextValidationRuleFunction {
        return (input: string): string | null => {
            if (input.toLowerCase() !== input) {
                return "Must be lowercase";
            }
            return null;
        };
    }

    public static englishCharsOnly(): TextValidationRuleFunction {
        return (input: string): string | null => {
            if (input === "") {
                return null;
            }
            const regex: RegExp = new RegExp(/^[A-Za-z]+$/);
            if (!regex.test(input)) {
                return "Must be [A-Za-z]";
            }
            return null;
        };
    }

    public static englishDashesUnderscoresOnly(): TextValidationRuleFunction {
        return (input: string): string | null => {
            if (input === "") {
                return null;
            }
            const regex: RegExp = new RegExp(/^[A-Za-z\-_]+$/);
            if (!regex.test(input)) {
                return "Must be [A-Za-z], or '-' or '_'";
            }
            return null;
        };
    }

    public validate(input: string): string | null {
        let result: string | null = null;

        for (let i: number = 0; i < this.rules.length; i++) {
            const validateResult: string | null = this.rules[i](input);
            if (validateResult != null) {
                if (result == null) {
                    result = validateResult;
                } else {
                    result += "\n" + validateResult;
                }
            }
        }
        return result;
    }

}