import { useEffect, useState } from "react";
import { useInput, Text, Box, useApp, useStdout } from "ink";

import Divider from "ink-divider";
import Spinner from "ink-spinner";

import Board from "./Board.js";
import Info from "./Info.js";

import { Agent, AI } from "../lib/agent.js";
import State from "../lib/state.js";
import { Direction } from "../lib/types.js";

interface IProps {
	agent1: Agent;
	agent2: Agent;
	size: number;
}

const Game: React.FC<IProps> = ({ agent1, agent2, size }) => {
	const [state, setState] = useState<State>(State.init(size));
	const [turn, setTurn] = useState<1 | 2>(1);
	const [over, setOver] = useState<boolean>(false);
	const { exit } = useApp();
	const stdout = useStdout();

	const winner = () => {
		if (state.player1.score > state.player2.score) {
			return { text: "A has won", color: "green" };
		} else if (state.player1.score < state.player2.score) {
			return { text: "B has won", color: "red" };
		} else {
			return { text: "DRAW", color: "yellow" };
		}
	};

	const currentAgent = () => {
		if (turn === 1) {
			return agent1;
		} else {
			return agent2;
		}
	};

	const isAi = () => {
		if (currentAgent() instanceof AI) {
			return true;
		}
		return false;
	};

	const handleMove = (dir: Direction) => {
		const newState = state.transition(dir);
		setState(newState);
		setTurn(turn === 1 ? 2 : 1);
	};

	useInput((input, key) => {
		if (isAi()) {
			return;
		}
		if (over) {
			exit();
		}
		let dir: Direction | null = null;
		if (key.upArrow || input.toLowerCase() === "w") {
			dir = Direction.Up;
		} else if (key.downArrow || input.toLowerCase() === "s") {
			dir = Direction.Down;
		} else if (key.rightArrow || input.toLowerCase() === "d") {
			dir = Direction.Right;
		} else if (key.leftArrow || input.toLowerCase() === "a") {
			dir = Direction.Left;
		}
		if (dir !== null) {
			const available = state.getActions();
			if (available.includes(dir)) {
				handleMove(dir);
			}
		}
	});

	useEffect(() => {
		if (isAi()) {
			const player = currentAgent() as AI;
			const dir = player.play(state);
			handleMove(dir);
			stdout.write("\x07");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [turn]);

	useEffect(() => {
		if (state.isTerminal()) {
			setOver(true);
		}
	}, [state]);

	if (over) {
		const w = winner();

		return (
			<>
				<Info players={[state.player1, state.player2]} turn={turn} />
				<Box width="100%" alignItems="center" justifyContent="center">
					<Box
						width="90%"
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						margin={1}
						borderStyle="single"
						borderColor="yellow"
					>
						<Text backgroundColor="yellow">GAME OVER</Text>

						<Text bold color={w.color}>
							{w.text}
						</Text>
					</Box>
				</Box>
			</>
		);
	} else {
		return (
			<>
				<Info players={[state.player1, state.player2]} turn={turn} />
				<Divider />
				<Board
					board={state.board}
					players={[state.player1, state.player2]}
				/>
				<Divider />
				{isAi() && <Spinner type="arc" />}
			</>
		);
	}
};

export default Game;
