export class Game {

    constructor(private board: (string | null)[][]) { }

    checkHorizantally(user: string) {
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i].every(item => item === user)) {
                return true;
            }
        }

        return false;
    }

    checkVertically(user: string) {
        for (let i = 0; i < this.board.length; i++) {
            if (this.board.every(row => row[i] === user)) {
                return true
            }
        }
        return false;
    }


    checkDiagonal(user: string) {
        if (this.board[0][0] === user && this.board[1][1] === user && this.board[2][2] === user)
            return true
        if (this.board[0][2] === user && this.board[1][1] === user && this.board[2][0] === user)
            return true
        return false;
    }



    isValidPosition(position: string) {
        const [x, y] = position.split(',').map(num => Number(num));
        return this.board[x][y] === null
    }
}