import { log } from "#settings";
import chalk from "chalk";
import { Collection } from "discord.js";
export class Event {
    static items = new Collection();
    constructor(data) {
        const events = Event.items.get(data.event) ?? new Collection();
        events.set(data.name, data);
        Event.items.set(data.event, events);
    }
    static register(client) {
        const eventHandlers = Event.items.map((collection, event) => {
            const handlers = collection.map(({ run, once }) => ({ run, once }));
            return { event, handlers };
        });
        for (const { event, handlers } of eventHandlers) {
            client.on(event, (...args) => {
                handlers.forEach(({ run, once }) => !once && run(...args));
            });
            client.once(event, (...args) => {
                handlers.forEach(({ run, once }) => once && run(...args));
            });
        }
    }
    static loadLogs() {
        for (const events of Event.items.values()) {
            events.forEach(({ name }) => {
                log.success(chalk.green(`${chalk.yellow.underline(name)} event loaded!`));
            });
        }
    }
}
