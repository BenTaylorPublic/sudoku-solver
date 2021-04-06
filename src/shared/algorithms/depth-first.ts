import {SudokuAlgorithm} from "../sudoku-algorithm";
import {SudokuState} from "../sudoku-state";
import {DrawableSudokuState} from "../drawable-sudoku-state";

export class DepthFirst implements SudokuAlgorithm {
    public name: string = "Depth First";

    setup(initialBoard: SudokuState): void {
    }

    step(): DrawableSudokuState {
        //@ts-ignore
        return null;
    }

    get givenUp(): boolean {
        return false;
    }

}