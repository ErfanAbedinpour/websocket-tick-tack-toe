import { Actions } from "../constant/actions.enum";
import { GameNotFound } from "../error/game.notFound.error";
import { InvalidMoveError } from "../error/invalid.move.error";
import { UserNotFound } from "../error/user.notFound.error";
import { WrongTrunError } from "../error/wrong-turn.error.";
import { RoomStates } from "../types/states";
import { MoveDto } from "./dto/move-game.dto";

export enum GameUserSymbol {
    x = "x",
    y = "y"
}

export class GameService {
    private board: (string | null)[][];
    constructor() { }

    // check Horizantally of board
    private checkHorizantally(user: GameUserSymbol): boolean {
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i].every(item => item === user)) {
                return true;
            }
        }

        return false;
    }

    // check vertically of board
    private checkVertically(user: GameUserSymbol): boolean {
        for (let i = 0; i < this.board.length; i++) {
            if (this.board.every(row => row[i] === user)) {
                return true
            }
        }
        return false;
    }


    // check Diagonal  of Board 
    private checkDiagonal(user: GameUserSymbol): boolean {
        if (this.board[0][0] === user && this.board[1][1] === user && this.board[2][2] === user)
            return true
        if (this.board[0][2] === user && this.board[1][1] === user && this.board[2][0] === user)
            return true
        return false;
    }


    // parse Position
    private parsePosition(position: string): number[] {
        return position.split(',').map(value => Number(value));
    }

    // check for validation possition
    private isValidPosition(position: string): boolean {

        const [x, y] = this.parsePosition(position);
        return this.board[x][y] === null
    }
    // check user is Win or not
    isUserWin(user: GameUserSymbol): boolean {
        return (
            this.checkHorizantally(user)
            ||
            this.checkVertically(user)
            ||
            this.checkDiagonal(user)
        )
    }
    // movement  
    move(data: MoveDto): boolean {
        const { clientId, gameId, move } = data;

        const game = RoomStates.get(gameId);

        if (!game)
            throw new GameNotFound("game not found");


        const user = game.players.find(player => player.connectionId == clientId);


        if (!user)
            throw new UserNotFound("user not found")

        if (!user.myTurn)
            throw new WrongTrunError("not your turn")

        this.board = game.board;

        const { x, y } = move;

        if (!this.isValidPosition(`${x},${y}`))
            throw new InvalidMoveError("invalid movment");

        this.board[x][y] = user.symbol;
        return true;
    }
}