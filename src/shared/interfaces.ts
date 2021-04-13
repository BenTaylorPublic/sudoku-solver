import {SudokuState} from "./sudoku-state";

export interface CellXY {
    x: ZeroToEight;
    y: ZeroToEight;
}

export interface PredefinedState {
    name: string;
    state: SudokuState;
}