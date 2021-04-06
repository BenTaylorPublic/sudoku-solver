import {SudokuCell} from "./sudoku-cell";

export class SudokuState {
    public cells: SudokuCell[][];

    constructor(cells: SudokuCell[][] | null = null) {
        if (cells == null) {

            this.cells = [];
            for (let y: number = 0; y < 9; y++) {
                this.cells.push([]);
                for (let x: number = 0; x < 9; x++) {
                    this.cells[y].push(new SudokuCell());
                }
            }
        } else {
            this.cells = [];
            for (let y: number = 0; y < 9; y++) {
                for (let x: number = 0; x < 9; x++) {
                    this.cells[y][x] = SudokuCell.clone(cells[y][x]);
                }
            }
        }
    }

    public static clone(state: SudokuState): SudokuState {
        const result: SudokuState = new SudokuState(state.cells);
        return result;
    }

    public setEmpty(): void {
    }

    public setInitialValue(x: number, y: number, value: number): void {
        this.cells[y][x].setInitialValue(value);
    }

    get isSolved(): boolean {
        for (let y: number = 0; y < 9; y++) {
            for (let x: number = 0; x < 9; x++) {
                if (this.cells[y][x].needsValue) {
                    return false;
                }
            }
        }
        return true;
    }

    public isValid(x: number, y: number, value: number): boolean {
        //Make sure cell isn't set
        if (!this.cells[y][x].needsValue) {
            return false;
        }
        //Checking x
        for (let x_iter: number = 0; x_iter < 9; x_iter++) {
            if (this.cells[y][x_iter].value === value) {
                return false;
            }
        }
        //Checking y
        for (let y_iter: number = 0; y_iter < 9; y_iter++) {
            if (this.cells[y_iter][x].value === value) {
                return false;
            }
        }
        //Checking 3x3
        let x_3x3_iter_start: number;
        let y_3x3_iter_start: number;
        if (x <= 2) {
            x_3x3_iter_start = 0;
        } else if (x <= 5) {
            x_3x3_iter_start = 3;
        } else {
            x_3x3_iter_start = 6;
        }
        if (y <= 2) {
            y_3x3_iter_start = 0;
        } else if (y <= 5) {
            y_3x3_iter_start = 3;
        } else {
            y_3x3_iter_start = 6;
        }
        for (let y_iter: number = y_3x3_iter_start; y_iter < y_3x3_iter_start + 3; y_iter++) {
            for (let x_iter: number = x_3x3_iter_start; x_iter < x_3x3_iter_start + 3; x_iter++) {
                if (this.cells[y_iter][x_iter].value === value) {
                    return false;
                }
            }
        }
        return true;
    }
}