import _ from "lodash";

import { BlockStatus, Board, Direction, Player, Position } from "./types.js";

class State {
	public board: Board;
	public turn: 1 | 2;
	public player1: Player;
	public player2: Player;
	public remainingPoints: number;

	constructor(
		board: Board,
		turn: 1 | 2,
		player1: Player,
		player2: Player,
		remainingPoints: number
	) {
		this.board = board;
		this.turn = turn;
		this.player1 = player1;
		this.player2 = player2;
		this.remainingPoints = remainingPoints;
	}

	public static init = (size: number): State => {
		const p1: Player = { symbol: "A", position: { x: 0, y: 0 }, score: 0 };

		const p2: Player = {
			symbol: "B",
			position: { x: size - 1, y: size - 1 },
			score: 0,
		};

		const b: Board = [];

		let points: number = 0;

		for (let i: number = 0; i < size; i++) {
			b.push([]);
			for (let j: number = 0; j < size; j++) {
				if (
					(i === p1.position.x && j === p1.position.y) ||
					(i === p2.position.x && j === p2.position.y)
				) {
					b[i].push({
						status: BlockStatus.Empty,
						reward: 0,
					});
				} else {
					const rew = Math.floor(Math.random() * 9 + 1);
					points += rew;
					b[i].push({
						status: BlockStatus.Available,
						reward: rew,
					});
				}
			}
		}

		return new State(b, 1, p1, p2, points);
	};

	private getCurrentPlayer = (): Player => {
		if (this.turn === 1) {
			return this.player1;
		} else {
			return this.player2;
		}
	};

	private getCurrentOpponent = (): Player => {
		if (this.turn === 1) {
			return this.player2;
		} else {
			return this.player1;
		}
	};

	private static npos = (pos: Position, dir: Direction): Position => {
		switch (dir) {
			case Direction.Up:
				return { x: pos.x, y: pos.y - 1 };
			case Direction.Down:
				return { x: pos.x, y: pos.y + 1 };
			case Direction.Left:
				return { x: pos.x - 1, y: pos.y };
			case Direction.Right:
				return { x: pos.x + 1, y: pos.y };
		}
	};

	private isValid = (dir: Direction): boolean => {
		const p = this.getCurrentPlayer();
		const o = this.getCurrentOpponent();

		const npos = State.npos(p.position, dir);

		if (
			npos.x < 0 ||
			npos.x >= this.board.length ||
			npos.y < 0 ||
			npos.y >= this.board.length
		) {
			return false;
		}

		if (npos.x === o.position.x && npos.y === o.position.y) {
			return false;
		}

		return true;
	};

	public getActions = (): Direction[] => {
		const actions: Direction[] = [];

		for (const dir of [
			Direction.Up,
			Direction.Down,
			Direction.Left,
			Direction.Right,
		]) {
			if (this.isValid(dir)) {
				actions.push(dir);
			}
		}

		return actions;
	};

	public transition = (dir: Direction): State => {
		const newBoard = _.cloneDeep(this.board);
		const newPlayer1 = _.cloneDeep(this.player1);
		const newPlayer2 = _.cloneDeep(this.player2);

		let remainingPoints = this.remainingPoints;

		if (this.turn === 1) {
			const npos = State.npos(this.player1.position, dir);
			newPlayer1.position = npos;
			const block = newBoard[npos.x][npos.y];
			if (block.status === BlockStatus.Available) {
				newPlayer1.score += block.reward;
				remainingPoints -= block.reward;
				newBoard[npos.x][npos.y].status = BlockStatus.Empty;
			}
		} else {
			const npos = State.npos(this.player2.position, dir);
			newPlayer2.position = npos;
			const block = newBoard[npos.x][npos.y];
			if (block.status === BlockStatus.Available) {
				newPlayer2.score += block.reward;
				remainingPoints -= block.reward;
				newBoard[npos.x][npos.y].status = BlockStatus.Empty;
			}
		}

		const newTurn = this.turn === 1 ? 2 : 1;

		const newState = new State(
			newBoard,
			newTurn,
			newPlayer1,
			newPlayer2,
			remainingPoints
		);

		return newState;
	};

	public getChildren = (): Map<Direction, State> => {
		const children: Map<Direction, State> = new Map();

		const actions = this.getActions();
		for (const dir of actions) {
			children.set(dir, this.transition(dir));
		}

		return children;
	};

	public isTerminal = (): boolean => {
		return this.remainingPoints === 0;
	};

	public utility = (): number => {
		return this.getCurrentPlayer().score - this.getCurrentOpponent().score;
	};

	public heuristic = (): number => {
		const currentPlayer = this.getCurrentPlayer();
		const opponent = this.getCurrentOpponent();

		// Base score difference without multiplication
		const util = this.utility();

		let accessiblePoints = 0;

		for (let i = 0; i < this.board.length; i++) {
			for (let j = 0; j < this.board.length; j++) {
				if (this.board[i][j].status === BlockStatus.Available) {
					const reward = this.board[i][j].reward;
					const playerDist =
						Math.abs(currentPlayer.position.x - i) +
						Math.abs(currentPlayer.position.y - j);
					const opponentDist =
						Math.abs(opponent.position.x - i) +
						Math.abs(opponent.position.y - j);

					// Simpler accessibility calculation
					if (playerDist < opponentDist) {
						accessiblePoints += reward / (playerDist + 1);
					} else if (opponentDist < playerDist) {
						accessiblePoints -= reward / (opponentDist + 1);
					}
				}
			}
		}

		return util + accessiblePoints * 0.5;
	};
}

export default State;
