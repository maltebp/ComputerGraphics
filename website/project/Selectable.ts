namespace Project {

    export interface Selectable {

        setPosition(position: number[]);

        getPosition(): number[];

        adjustRotation(adjustment: number);

        getCollisionPoints(): number[][];
    }

}