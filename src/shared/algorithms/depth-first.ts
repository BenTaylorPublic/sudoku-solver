import {SudokuAlgorithm} from "../sudoku-algorithm";
import {SudokuState} from "../sudoku-state";

export class DepthFirst implements SudokuAlgorithm {
    public name: string = "Depth First";

    setup(initialBoard: SudokuState): void {
    }

    step(): SudokuState {
        //@ts-ignore
        return null;
    }


}