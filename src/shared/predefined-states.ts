import {PredefinedState} from "./interfaces";
import {SudokuState} from "./sudoku-state";

export class PredefinedStates {
    public static getStates(): PredefinedState[] {
        return [PredefinedStates.state1];
    }

    private static get state1(): PredefinedState {
        const stateString: string =
            "--- 8-- 42-" +
            "5-- 67- ---" +
            "--- --9 --5" +

            "74- 1-- ---" +
            "--9 -3- 7--" +
            "--- --7 -48" +

            "8-- 4-- ---" +
            "--- -98 --3" +
            "-95 --3 ---";

        return {
            name: "State1",
            state: this.convertStateStringToSudokuState(stateString)
        };
    }

    private static convertStateStringToSudokuState(stateString: string): SudokuState {
        const result: SudokuState = new SudokuState();

        let x: number = 0;
        let y: number = 0;
        const incrementFn: () => void = function (): void {
            x++;
            if (x === 9) {
                x = 0;
                y++;
            }
        };

        for (let i: number = 0; i < stateString.length; i++) {
            const char: string = stateString[i];
            if (char === "-") {
                incrementFn();
            } else if (char === Number(char).toString()) {
                result.setInitialValue(x, y, Number(char));
                incrementFn();
            }
            //Else do nothing. It's likely a space.
        }

        return result;
    }
}