interface IPayoutsData {
    symbolName: string;
    pays: number[];
    description?: string;
}

export class PaytablePayouts {
    public static readonly PAYOUTS: IPayoutsData[] = [
        {
            symbolName: "lp1",
            pays: [0, 0, 5, 6, 7],
            description: "9.png"
        },
        {
            symbolName: "lp2",
            pays: [0, 0, 6, 7, 8],
            description: "10.png"
        },
        {
            symbolName: "lp3",
            pays: [0, 0, 7, 8, 9],
            description: "J.png"
        },
        {
            symbolName: "lp4",
            pays: [0, 0, 8, 9, 10],
            description: "Q.png"
        },
        {
            symbolName: "lp5",
            pays: [0, 0, 9, 10, 11],
            description: "K.png"
        },
        {
            symbolName: "lp6",
            pays: [0, 0, 10, 11, 12],
            description: "A.png"
        },
        {
            symbolName: "hp1",
            pays: [0, 0, 21, 22, 23],
            description: "Ruby"
        },
        {
            symbolName: "hp2",
            pays: [0, 0, 22, 23, 24],
            description: "Crown"
        },
        {
            symbolName: "hp3",
            pays: [0, 0, 23, 24, 25],
            description: "Seven"
        },
        {
            symbolName: "hp4",
            pays: [0, 0, 24, 25, 26],
            description: "Diamond"
        },
        {
            symbolName: "hp5",
            pays: [0, 0, 25, 26, 27],
            description: "Clover"
        },
        {
            symbolName: "hp6",
            pays: [0, 0, 26, 27, 28],
            description: ""
        },
    ];
}
