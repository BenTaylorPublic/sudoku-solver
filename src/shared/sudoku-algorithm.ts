import {SudokuState} from "./sudoku-state";
import {DrawableSudokuState} from "./drawable-sudoku-state";

export abstract class SudokuAlgorithm {
    public abstract name: string;

    constructor() {
    }

    public abstract setup(initialBoard: SudokuState): void;

    //Returns the state that should be drawn to the gui
    public abstract step(): DrawableSudokuState;

    public abstract get givenUp(): boolean;
}