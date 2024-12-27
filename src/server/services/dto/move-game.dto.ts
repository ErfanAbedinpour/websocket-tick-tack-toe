export class MoveDto {
    gameId: string;
    clientId: string;
    move: {
        x: number,
        y: number
    }
}