import { time } from "discord.js";
const timeUnit = {
    milliseconds: 1,
    seconds: 1000,
    minutes: 1000 * 60,
    hours: 1000 * 60 * 60,
    days: 1000 * 60 * 60 * 24
};
export class Cooldown {
    createdAtDate;
    defaultStyle;
    expiresAtDate;
    constructor(options = {}) {
        this.createdAtDate = options.createdAt ?? new Date();
        this.defaultStyle = options.defaultStyle ?? "R";
        this.expiresAtDate = new Date(this.createdAtDate);
    }
    get createdAt() {
        return this.createdAtDate;
    }
    get expiresAt() {
        return this.expiresAtDate;
    }
    display(style) {
        return time(this.expiresAt, style);
    }
    toString() {
        return this.display(this.defaultStyle);
    }
    add(value, unit) {
        const time = this.expiresAtDate.getMilliseconds();
        this.expiresAtDate.setMilliseconds(time + (value * timeUnit[unit]));
    }
    remove(value, unit) {
        const time = this.expiresAtDate.getMilliseconds();
        this.expiresAtDate.setMilliseconds(time - (value * timeUnit[unit]));
    }
}
