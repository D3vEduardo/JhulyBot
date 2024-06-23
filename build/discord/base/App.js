import { Command, Event, Responder } from "#base";
import { CustomItents, CustomPartials, spaceBuilder, toNull } from "@magicyan/discord";
import { Client, version as djsVersion } from "discord.js";
import { log, onError } from "#settings";
import ck from "chalk";
import glob from "fast-glob";
import path from "node:path";
export async function bootstrapApp(options) {
    if (options.multiple) {
        const clients = [];
        for (const token of process.env.BOT_TOKEN.split(" ")) {
            const client = createClient(token, options);
            clients.push(client);
        }
        await loadDirectories(path.basename(options.workdir), options.directories, options.loadLogs);
        for (const client of clients)
            startClient(client);
        return clients;
    }
    const client = createClient(process.env.BOT_TOKEN, options);
    await loadDirectories(path.basename(options.workdir), options.directories, options.loadLogs);
    startClient(client);
    return client;
}
async function loadDirectories(foldername, directories = [], loadLogs) {
    const pattern = "**/*.{ts,js,tsx,jsx}";
    const patterns = [
        `!./${foldername}/discord/base/*`,
        `./${foldername}/discord/${pattern}`,
        directories.map(dir => path.join(foldername, dir))
            .map(p => p.replaceAll("\\", "/"))
            .map(p => `./${p}/${pattern}`)
    ].flat();
    const paths = await glob(patterns, { absolute: true });
    await Promise.all(paths.map(path => import(`file://${path}`)));
    Responder.sortCustomIds();
    if (loadLogs ?? true) {
        Command.loadLogs();
        Event.loadLogs();
        Responder.loadLogs();
    }
    const versions = [
        `${ck.hex("#5865F2").underline("discord.js")} ${ck.yellow(djsVersion)}`,
        "/",
        `${ck.hex("#68a063").underline("NodeJs")} ${ck.yellow(process.versions.node)}`,
    ];
    console.log();
    log.success(spaceBuilder("📦", versions));
}
function createClient(token, options) {
    const client = new Client(Object.assign(options, {
        intents: options.intents ?? CustomItents.All,
        partials: options.partials ?? CustomPartials.All,
        failIfNotExists: false
    }));
    if (options.beforeLoad) {
        options.beforeLoad(client);
    }
    client.on("ready", async (client) => {
        const messages = new Array();
        const addMessage = (message) => messages.push(message);
        await client.guilds.fetch().catch(toNull);
        if (options.commands?.guilds) {
            const guilds = client.guilds.cache.filter(({ id }) => options?.commands?.guilds?.includes(id));
            await Command.register(addMessage, client, guilds);
        }
        else {
            await Command.register(addMessage, client);
        }
        log.log(ck.greenBright(`➝ Online as ${ck.hex("#57F287").underline(client.user.username)}`));
        for (const message of messages) {
            log.log(ck.green(` ${message}`));
        }
        process.on("uncaughtException", err => onError(err, client));
        process.on("unhandledRejection", err => onError(err, client));
        if (options.whenReady)
            options.whenReady(client);
    });
    client.on("interactionCreate", async (interaction) => {
        switch (true) {
            case interaction.isAutocomplete():
                Command.onAutocomplete(interaction);
                return;
            case interaction.isCommand():
                Command.onCommand(interaction);
                return;
            default:
                Responder.onInteraction(interaction);
                return;
        }
    });
    client.token = token;
    return client;
}
function startClient(client) {
    Event.register(client);
    client.login();
}
