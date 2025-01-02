import State from "./state.js";
import { Direction } from "./types.js";

export abstract class Agent {}

export class AI extends Agent {
	public difficulty: number;

	constructor(difficulty: number) {
		super();
		this.difficulty = difficulty;
	}

	public play = (s: State): Direction => {
		const children = s.getChildren();

		const options: { dir: Direction; value: number }[] = [];

		for (const [dir, child] of children) {
			const childValue = AI.minimax(
				child,
				this.difficulty,
				Number.NEGATIVE_INFINITY,
				Number.POSITIVE_INFINITY,
				false
			);

			const option = {
				dir,
				value: childValue,
			};

			options.push(option);
		}

		const max = options.reduce(
			(previous, current) =>
				current.value > previous.value ? current : previous,
			options[0]
		);

		return max.dir;
	};

	public static minimax = (
		state: State,
		depth: number,
		alpha: number,
		beta: number,
		isMax: boolean
	) => {
		if (state.isTerminal() || depth === 0) {
			return state.utility();
		}

		if (isMax) {
			let v = Number.NEGATIVE_INFINITY;

			const children = state.getChildren();
			for (const child of children) {
				const cv = AI.minimax(child[1], depth - 1, alpha, beta, false);
				v = Math.max(v, cv);
				alpha = Math.max(alpha, v);
				if (beta <= alpha) {
					break;
				}
			}

			return v;
		} else {
			let v = Number.POSITIVE_INFINITY;

			const children = state.getChildren();
			for (const child of children) {
				const cv = AI.minimax(child[1], depth - 1, alpha, beta, true);
				v = Math.min(v, cv);
				beta = Math.min(beta, v);
				if (beta <= alpha) {
					break;
				}
			}

			return v;
		}
	};
}

export class Human extends Agent {
	constructor() {
		super();
	}
}
