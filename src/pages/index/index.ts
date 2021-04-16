import {SudokuState} from "../../shared/sudoku-state";
import {SudokuAlgorithm} from "../../shared/sudoku-algorithm";
import {DepthFirst} from "../../shared/algorithms/depth-first";
import {SudokuCell} from "../../shared/sudoku-cell";
import {DrawableSudokuState} from "../../shared/drawable-sudoku-state";
import {StepAction} from "../../shared/enums";
import {PredefinedState, Stat} from "../../shared/interfaces";
import {PredefinedStates} from "../../shared/predefined-states";

class IndexView {

    private static predefinedStatesSelect: HTMLSelectElement;
    private static startButton: HTMLButtonElement;
    private static stepButton: HTMLButtonElement;
    private static runTypeSelect: HTMLSelectElement;
    private static inputX: HTMLInputElement;
    private static statsDiv: HTMLDivElement;
    private static algorithm: SudokuAlgorithm;
    private static stepCount: number = 0;
    private static startTime: Date;

    public static initialize(): void {
        this.startButton = document.getElementById("startButton") as HTMLButtonElement;
        this.startButton.onclick = this.start.bind(this);
        this.stepButton = document.getElementById("stepButton") as HTMLButtonElement;
        this.stepButton.onclick = this.manualStep.bind(this);
        this.runTypeSelect = document.getElementById("runType") as HTMLSelectElement;
        this.runTypeSelect.onchange = this.runTypeChange.bind(this);
        this.inputX = document.getElementById("inputX") as HTMLInputElement;
        this.inputX.onchange = this.validate.bind(this);
        this.predefinedStatesSelect = document.getElementById("predefinedStates") as HTMLSelectElement;
        this.predefinedStatesSelect.onchange = this.predefinedStatesChange.bind(this);
        this.statsDiv = document.getElementById("stats") as HTMLInputElement;
        this.createPredefinedStatesOptions();
        this.createEntryInputs();
        this.validate();
        this.createVisualizationDivs();
    }

    private static createPredefinedStatesOptions(): void {
        const predefinedStates: PredefinedState[] = PredefinedStates.getStates();
        for (let i: number = 0; i < predefinedStates.length; i++) {
            const predefinedState: PredefinedState = predefinedStates[i];
            const option: HTMLOptionElement = document.createElement("option");
            option.value = predefinedState.name;
            option.innerText = predefinedState.name;
            this.predefinedStatesSelect.appendChild(option);
        }
    }

    private static createEntryInputs(): void {
        const inputBoxes: HTMLDivElement = document.getElementById("inputBoxes") as HTMLDivElement;

        for (let y: number = 0; y < 9; y++) {
            const row: HTMLDivElement = document.createElement("div");
            row.classList.add("row");
            let verticalSection: HTMLDivElement = document.createElement("div");
            verticalSection.classList.add("verticalSection");
            for (let x: number = 0; x < 9; x++) {
                const input: HTMLInputElement = document.createElement("input");
                input.type = "number";
                input.id = `i-${y}-${x}`;
                input.min = "1";
                input.max = "9";
                input.onkeyup = this.validate.bind(this);

                verticalSection.appendChild(input);

                if (x === 2 || x === 5) {
                    row.appendChild(verticalSection);
                    verticalSection = document.createElement("div");
                    verticalSection.classList.add("verticalSection");
                }
            }
            row.appendChild(verticalSection);

            inputBoxes.appendChild(row);

            if (y === 2 || y === 5) {
                const horizontalSection = document.createElement("div");
                horizontalSection.classList.add("horizontalSection");
                inputBoxes.appendChild(horizontalSection);
            }
        }
    }

    private static validate(): void {
        //Check all values
        const validValues: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ""];
        for (let y: number = 0; y < 9; y++) {
            for (let x: number = 0; x < 9; x++) {
                const id: string = `i-${y}-${x}`;
                const input: HTMLInputElement = document.getElementById(id) as HTMLInputElement;
                if (!validValues.includes(input.value)) {
                    //Invalid
                    this.startButton.disabled = true;
                    return;
                }
            }
        }

        if (Number(this.inputX.value) <= 0 && this.runTypeSelect.value !== "manual") {
            //Invalid
            this.startButton.disabled = true;
            return;
        }

        this.startButton.disabled = false;
    }

    private static createVisualizationDivs(): void {
        const visualizationBoxes: HTMLDivElement = document.getElementById("visualizationBoxes") as HTMLDivElement;

        for (let y: number = 0; y < 9; y++) {
            const row: HTMLDivElement = document.createElement("div");
            row.classList.add("row");
            let verticalSection: HTMLDivElement = document.createElement("div");
            verticalSection.classList.add("verticalSection");
            for (let x: number = 0; x < 9; x++) {
                const div: HTMLDivElement = document.createElement("div");
                div.id = `v-${y}-${x}`;
                div.classList.add("vCell");
                verticalSection.appendChild(div);

                if (x === 2 || x === 5) {
                    row.appendChild(verticalSection);
                    verticalSection = document.createElement("div");
                    verticalSection.classList.add("verticalSection");
                }
            }
            row.appendChild(verticalSection);

            visualizationBoxes.appendChild(row);

            if (y === 2 || y === 5) {
                const horizontalSection = document.createElement("div");
                horizontalSection.classList.add("horizontalSection");
                visualizationBoxes.appendChild(horizontalSection);
            }
        }
    }

    private static predefinedStatesChange(): void {
        const value: string = this.predefinedStatesSelect.value;
        const predefinedStates: PredefinedState[] = PredefinedStates.getStates();
        let predefinedState: PredefinedState | null = null;
        for (let i: number = 0; i < predefinedStates.length; i++) {
            if (predefinedStates[i].name === value) {
                predefinedState = predefinedStates[i];
                break;
            }
        }
        if (predefinedState == null) {
            //Just make one that clears it
            predefinedState = {
                name: "Empty",
                state: new SudokuState()
            };
        }

        for (let y: number = 0; y < 9; y++) {
            for (let x: number = 0; x < 9; x++) {
                const id: string = `i-${y}-${x}`;
                const input: HTMLInputElement = document.getElementById(id) as HTMLInputElement;
                const valueOfCell: number | null = predefinedState.state.cells[y][x].value;
                if (valueOfCell != null) {
                    input.value = valueOfCell.toString();
                } else {
                    input.value = "";
                }
            }
        }
        this.validate();
    }

    private static runTypeChange(): void {
        const value: RunType = this.runTypeSelect.value as RunType;
        if (value === "manual") {
            this.inputX.parentElement?.classList.add("displayNone");
        } else {
            this.inputX.parentElement?.classList.remove("displayNone");
        }
        this.validate();
    }

    private static start(): void {
        this.startButton.classList.add("displayNone");
        this.runTypeSelect.parentElement?.classList.add("displayNone");
        this.inputX.parentElement?.classList.add("displayNone");
        this.predefinedStatesSelect.parentElement?.classList.add("displayNone");
        document.getElementById("inputBoxes")?.parentElement?.classList.add("displayNone");
        document.getElementById("visualization")?.classList.remove("displayNone");
        document.getElementById("textOutput")?.classList.remove("displayNone");

        const startingState: SudokuState = new SudokuState();

        for (let y: number = 0; y < 9; y++) {
            for (let x: number = 0; x < 9; x++) {
                const id: string = `i-${y}-${x}`;
                const input: HTMLInputElement = document.getElementById(id) as HTMLInputElement;
                if (input.value !== "") {
                    startingState.setInitialValue(x, y, Number(input.value));
                }
            }
        }
        this.initialDraw(startingState);

        const runType: RunType = (document.getElementById("runType") as HTMLInputElement).value as RunType;
        const prettyRunType: string = runType[0].toUpperCase() + runType.slice(1, runType.length);
        let runParamsString = `Run type: <span class="val">${prettyRunType}</span>`;
        let xValue: number;
        if (runType === "manual") {
            xValue = 1;
        } else {
            xValue = Number(this.inputX.value);
            runParamsString += "<br/>";
            if (runType === "autoStepDelay") {
                runParamsString += `Delay <span class="val">${xValue}ms</span> after every step`;
            } else {
                runParamsString += `Delay 1ms, after doing <span class="val">${xValue}</span> steps`;
            }
        }

        const runParamsDiv: HTMLDivElement = document.getElementById("runParams") as HTMLDivElement;
        runParamsDiv.innerHTML = runParamsString;


        this.solvingLogic(startingState, runType, xValue);
    }

    private static async solvingLogic(startingState: SudokuState, runType: RunType, x: number): Promise<void> {
        this.algorithm = new DepthFirst();
        this.startTime = new Date();
        this.algorithm.setup(startingState);
        if (runType === "autoStepDelay") {
            const delay: number = x;
            let state: DrawableSudokuState;
            do {
                state = this.algorithm.step();
                this.stepCount++;
                this.draw(state);
                await this.delay(delay);
                if ((state.isSolved && state.action === StepAction.Assigned) || this.algorithm.givenUp) {
                    break;
                }
            } while (true);
        } else if (runType === "autoStepGroupDraw") {
            const drawEveryXSteps: number = x;
            let stepCount: number = 0;
            let state: DrawableSudokuState;
            do {
                state = this.algorithm.step();
                this.stepCount++;
                stepCount++;
                if (stepCount === drawEveryXSteps) {
                    stepCount = 0;
                    this.draw(state);
                    //Delay to let it draw to dom
                    await this.delay(1);
                }
                if ((state.isSolved && state.action === StepAction.Assigned) || this.algorithm.givenUp) {
                    break;
                }
            } while (true);
            this.draw(state);
        } else if (runType === "manual") {
            this.stepButton.classList.remove("displayNone");
        }

    }

    private static manualStep(): void {
        this.stepButton.disabled = true;
        const state: DrawableSudokuState = this.algorithm.step();
        this.stepCount++;
        this.draw(state);
        if (state.isSolved || this.algorithm.givenUp) {
            alert("End");
            return;
        }
        this.stepButton.disabled = false;
    }

    private static draw(state: DrawableSudokuState): void {
        for (let y: number = 0; y < 9; y++) {
            for (let x: number = 0; x < 9; x++) {
                const id: string = `v-${y}-${x}`;
                const div: HTMLDivElement = document.getElementById(id) as HTMLDivElement;
                const cell: SudokuCell = state.cells[y][x];
                if (cell.value == null) {
                    div.innerText = "";
                } else {
                    div.innerText = cell.value.toString();
                }

                if (cell.locked) {
                    div.classList.add("locked");
                } else {
                    div.classList.remove("locked");
                }

                div.classList.remove("assigned");
                div.classList.remove("failedToAssign");
            }
        }

        if (state.lastActionedCell != null) {
            const id: string = `v-${state.lastActionedCell.y}-${state.lastActionedCell.x}`;
            const div: HTMLDivElement = document.getElementById(id) as HTMLDivElement;
            if (state.action === StepAction.Assigned) {
                div.classList.add("assigned");
            } else {
                div.classList.add("failedToAssign");
            }
        }


        const now: Date = new Date();
        const seconds: number = Math.round((now.getTime() - this.startTime.getTime()) / 10) / 100;

        let stats: string = `Steps: <span class="val">${this.stepCount}</span><br/>`;
        stats += `Duration: <span class="val">${seconds}s</span>`;
        for (let i: number = 0; i < state.stats.length; i++) {
            const stat: Stat = state.stats[i];
            stats += `<br/>${stat.name}: <span class="val">${stat.value}</span>`;
        }
        this.statsDiv.innerHTML = stats;
    }

    private static initialDraw(state: SudokuState): void {
        for (let y: number = 0; y < 9; y++) {
            for (let x: number = 0; x < 9; x++) {
                const id: string = `v-${y}-${x}`;
                const div: HTMLDivElement = document.getElementById(id) as HTMLDivElement;
                const cell: SudokuCell = state.cells[y][x];
                if (cell.value != null) {
                    div.innerText = cell.value.toString();
                }

                if (cell.locked) {
                    div.classList.add("locked");
                }
            }
        }
    }

    private static async delay(ms: number): Promise<void> {
        await new Promise(resolve => setTimeout(() => resolve(1), ms));
    }
}

IndexView.initialize();