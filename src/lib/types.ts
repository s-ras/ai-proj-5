export enum Direction {
	Up = "Up",
	Down = "Down",
	Left = "Left",
	Right = "Right",
}

export enum BlockStatus {
	Empty = "Empty",
	Available = "Available",
}

export type Position = { x: number; y: number };

export type Player = { symbol: string; position: Position; score: number };

export type Block = { reward: number; status: BlockStatus };

export type Board = Block[][];
