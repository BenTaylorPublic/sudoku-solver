import {PredefinedState} from "./interfaces";
import {SudokuState} from "./sudoku-state";

export class PredefinedStates {
    public static getStates(): PredefinedState[] {
        return [PredefinedStates.state1];
    }

    private static get state1(): PredefinedState {
        const result: PredefinedState = {
            name: "State1",
            state: new SudokuState()
        };
        result.state.setInitialValue(3, 0, 8);
        result.state.setInitialValue(6, 0, 4);
        result.state.setInitialValue(7, 0, 2);
        result.state.setInitialValue(0, 1, 5);
        result.state.setInitialValue(3, 1, 6);
        result.state.setInitialValue(4, 1, 7);
        result.state.setInitialValue(5, 2, 9);
        result.state.setInitialValue(8, 2, 5);
        result.state.setInitialValue(0, 3, 7);
        result.state.setInitialValue(1, 3, 4);
        result.state.setInitialValue(3, 3, 1);
        result.state.setInitialValue(2, 4, 9);
        result.state.setInitialValue(4, 4, 3);
        result.state.setInitialValue(6, 4, 7);
        result.state.setInitialValue(5, 5, 7);
        result.state.setInitialValue(7, 5, 4);
        result.state.setInitialValue(8, 5, 8);
        result.state.setInitialValue(0, 6, 8);
        result.state.setInitialValue(3, 6, 4);
        result.state.setInitialValue(4, 7, 9);
        result.state.setInitialValue(5, 7, 8);
        result.state.setInitialValue(8, 7, 3);
        result.state.setInitialValue(1, 8, 9);
        result.state.setInitialValue(2, 8, 5);
        result.state.setInitialValue(5, 8, 3);

        return result;
    }
}