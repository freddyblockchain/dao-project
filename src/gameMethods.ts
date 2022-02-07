import AlgodClient from "algosdk/dist/types/src/client/v2/algod/algod";
import { choiceCoinBalance, downAddress, leftAddress, rightAddress, upAddress } from "./helper";
import {GameState } from "./resultWorker";

const map: string[] = 'Bxxxxxxx,xbxbxxxx,xbxxxxxx,xxxxxxbx,xxxxxbxx,bxxxxxxx,xxxxbxxb,xxxxxxxA,'.split(',');

export const invalidMove = (x: number, y:number): boolean => {
    return x < 0 || x > 7 || y < 0 || y > 7;
}

export const move = (direction: Direction, pos:{x: number, y:number}): {x: number,y: number} => {
    switch(direction){
        case Direction.UP:
            if(!invalidMove(pos.x - 1,pos.y)){
                return {x:pos.x - 1,y:pos.y}
            }
        case Direction.RIGHT:
            if(!invalidMove(pos.x,pos.y + 1)){
                return {x:pos.x ,y:pos.y + 1}
            }
        case Direction.DOWN:
            if(!invalidMove(pos.x + 1,pos.y)){
                return {x:pos.x + 1,y:pos.y}
            }
        case Direction.LEFT:
            if(!invalidMove(pos.x,pos.y - 1)){
                return {x:pos.x,y:pos.y - 1}
            }
    }
    return {x:pos.x,y:pos.y}
}

export const calculateState = async (prevState: GameState, client: AlgodClient):Promise<GameState> => {
    const direction = await calculateDirection(client);
    const pos = move(direction, prevState.position);
    const posAfterField = getFieldResult(pos);

    return {
        counter: prevState.counter + 1,
        position: posAfterField.pos,
        field: posAfterField.field,
        direction,
        aliceCount: posAfterField.field === Field.ALICE ? prevState.aliceCount + 1 : prevState.aliceCount,
    }
}

const getFieldResult = (pos: {x: number,y:number}): {field: Field, pos: {x:number,y:number}} => {
    if(map[pos.x][pos.y] === 'b'){
        return {field: Field.BOMB, pos:{x:7,y:7}};
    }
    if(map[pos.x][pos.y] === 'B'){
        return {field: Field.ALICE, pos:{x:7,y:7}};
    }
    return {field: Field.NOTHING, pos};
}


const calculateDirection = async (client: AlgodClient) => {
    const upBalance = await choiceCoinBalance(upAddress,client);
    const rightBalance = await choiceCoinBalance(rightAddress,client);
    const downBalance = await choiceCoinBalance(downAddress,client);
    const leftBalance = await choiceCoinBalance(leftAddress,client);

    const max = Math.max(upBalance,rightBalance,downBalance,leftBalance);

    if(max == upBalance && rightBalance != max && downBalance != max && leftBalance!= max){
        return Direction.UP;
    }
    if(rightBalance == max && upBalance!= max && downBalance!= max && leftBalance!= max){
        return Direction.RIGHT;
    }
    if(downBalance == max && upBalance!= max && rightBalance!= max && leftBalance!= max){
        return Direction.DOWN;
    }
    if(leftBalance == max && upBalance!= max && rightBalance!= max && downBalance!= max){
        return Direction.LEFT;
    }
    return Direction.STAY;
}

export enum Direction {
    UP,
    RIGHT,
    DOWN,
    LEFT,
    STAY,
  }
export enum Field {
    BOMB,
    ALICE,
    NOTHING,
}