export class SudokuCell {
    public locked: boolean;
    public value: number | null;

    constructor() {
        this.locked = false;
        this.value = null;
    }


    public static clone(cell: SudokuCell): SudokuCell {
        const result: SudokuCell = new SudokuCell();
        result.locked = cell.locked;
        result.value = cell.value;
        return result;
    }

    public setInitialValue(value: number): void {
        this.value = value;
        this.locked = true;
    }

    public get needsValue(): boolean {
        return this.value == null;
    }
}