import { Event } from "#base";
import { log, settings } from "#settings";
import chalk from "chalk";
import { ActivityType } from "discord.js";
new Event({
    name: "Set Presence",
    event: "ready",
    async run(client) {
        client.user.setActivity({
            name: `JhulyBot ${settings.version}`,
            type: ActivityType.Playing,
        });
        log.success(chalk.green("✔ Rich Presence setado!"));
    },
});
