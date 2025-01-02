import Game from "./components/Game.js";
import { AI, Human } from "./lib/agent.js";

const a = new AI(15);
const h = new Human();
const s = 4;

const App = () => {
	return <Game agent1={h} agent2={a} size={s} />;
};

export default App;
