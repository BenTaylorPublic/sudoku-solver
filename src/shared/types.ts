type TCallback<T> = (data: T) => void;
type VoidCallback = () => void;
type OnTextInputValidationChange = (newValue: string, validationResult: string | null) => void;