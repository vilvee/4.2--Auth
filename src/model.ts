export interface Pokemon {
    id: number;
    name: string;
    type: string;
}

export const database: Pokemon[] = [
    { id: 1, name: "Bulbasaur", type: "Grass" },
    { id: 2, name: "Charmander", type: "Fire" },
    { id: 3, name: "Squirtle", type: "Water" },
];
