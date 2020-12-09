namespace Project {

    /**
     * Interface for Light and Sprites, to generalize selection functionality
     */
    export interface Selectable {

        setPosition(position: number[]): void;

        getPosition(): number[];

        getCollisionPoints(): number[][];
    }

}