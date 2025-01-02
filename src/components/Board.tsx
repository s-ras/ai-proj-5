import { Box, Text } from "ink";
import { BlockStatus, Board, Player } from "../lib/types.js";

interface IProps {
	board: Board;
	players: Player[];
}

const Board: React.FC<IProps> = ({ board, players }) => {
	const getColor = (i: number, j: number) => {
		if (i === players[0].position.x && j === players[0].position.y) {
			return "green";
		} else if (i === players[1].position.x && j === players[1].position.y) {
			return "red";
		} else if (board[i][j].status === BlockStatus.Available) {
			return "yellow";
		} else {
			return "gray";
		}
	};

	const getChar = (i: number, j: number) => {
		if (i === players[0].position.x && j === players[0].position.y) {
			return players[0].symbol;
		} else if (i === players[1].position.x && j === players[1].position.y) {
			return players[1].symbol;
		} else if (board[i][j].status === BlockStatus.Available) {
			return board[i][j].reward.toString();
		} else {
			return "X";
		}
	};

	return (
		<Box
			width="100%"
			paddingY={1}
			alignItems="center"
			justifyContent="center"
		>
			<Box
				width={board.length * 3.5}
				alignItems="center"
				justifyContent="center"
				borderStyle="round"
				borderColor="blackBright"
			>
				{board.map((row, i) => (
					<Box key={`x-${i}`} flexDirection="column">
						{row.map((block, j) => (
							<Box key={`y-${j}`} paddingX={1}>
								<Text bold color={getColor(i, j)}>
									{getChar(i, j)}
								</Text>
							</Box>
						))}
					</Box>
				))}
			</Box>
		</Box>
	);
};

export default Board;
