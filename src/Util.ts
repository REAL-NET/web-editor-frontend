export const toInt = (value: string): number => {
    let intValue = Number(value);
    if (Number.isNaN(intValue)) {
        console.error(value + " is not a integer");
        return 0;
    }
    return intValue;
}

