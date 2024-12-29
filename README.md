# websocket-tick-tack-toe
Simple tick Tack Toe Game with Nodejs And Pure WebScoket Protocol and Redis Cache manager

## Approach
1. [x] Create Game
2. [x] Joined Game 
3. [x] Show LeaderBorad
4. [x] Play Game

## Stack
- Nodejs(http std module)
- WebSocket(pure webSocket)


# Game Picture 
![image info](/images/screen.png)

## Requirement
- NodeJs>18

## Start
```bash
# step 1
git clone https://github.com/ErfanAbedinpour/websocket-tick-tack-toe.git
```
```bash
# step 2
cd websocket-tick-tack-toe
```
```bash
#step3
npm i 
```
```bash
# and select your port in this file
#step4
cp .env.example ./.env
```
```bash
# step 5
npm run build
npm run start
```
# Start game 
### step 1
-  go to localhost:{port in .envFile} in your browser and create new game
### step 2
- another browser or new tab go to same url and enter gameId and joined to game 

### step 3
- BOOM game is ready
