import { Text, Box, Spacer } from "ink";

import { Player } from "../lib/types.js";

interface IProps {
	players: Player[];
	turn: 1 | 2;
}

const Info: React.FC<IProps> = ({ players, turn }) => {
	const getColor = () => {
		if (turn === 1) {
			return "green";
		} else {
			return "red";
		}
	};

	const getTurn = () => {
		if (turn === 1) {
			return "A's Turn";
		} else {
			return "B's Turn";
		}
	};

	return (
		<Box width="100%">
			<Spacer />
			<Text bold color="green">
				Player A : <Text color="greenBright">{players[0].score}</Text>
			</Text>
			<Spacer />
			<Box margin={0} paddingX={2}>
				<Text bold backgroundColor={getColor()}>
					{getTurn()}
				</Text>
			</Box>
			<Spacer />
			<Text bold color="red">
				Player B : <Text color="redBright">{players[1].score}</Text>
			</Text>
			<Spacer />
		</Box>
	);
};

export default Info;
