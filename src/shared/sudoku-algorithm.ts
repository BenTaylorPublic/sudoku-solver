import {SudokuState} from "./sudoku-state";

export abstract class SudokuAlgorithm {
    public abstract name: string;

    constructor() {
    }

    public abstract setup(initialBoard: SudokuState): void;

    //Returns the state that should be drawn to the gui
    public abstract step(): SudokuState;

    public abstract get givenUp(): boolean;
}