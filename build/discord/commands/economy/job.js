import { Command } from "#base";
import { FirebaseCruds } from "#database";
import { Embed, FormatSaldo, inCooldown } from "#functions";
import { settings } from "#settings";
import { jobs } from "#assets";
import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ApplicationCommandType, time } from "discord.js";
import { createRow } from "@magicyan/discord";
new Command({
    name: "trabalhar",
    description: "Trabalhe para receber JhulyBucks!",
    dmPermission: true,
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        if (await inCooldown(interaction))
            return;
        const author = interaction.user;
        const authorData = await FirebaseCruds.get(`/users/${author.id}`);
        const authorJob = authorData.userDetails.status ? authorData.userDetails.status.find(i => i.name === "job") : null;
        if (authorJob && "name" in authorJob && "expire" in authorJob && new Date(authorJob.expire).getTime() > Date.now()) {
            await interaction.reply({
                embeds: [Embed(interaction).setDescription(`${settings.emojis.error} ${author}, você ainda está trabalhando como \`${jobs[authorJob.data].name}\`. Seu expediente terminará ${time(Math.floor(authorJob.expire / 1000), "R")}.`)]
            });
            return;
        }
        const embed = Embed(interaction)
            .setTitle(`${settings.emojis.job} Trabalhar`)
            .setDescription(`${author}, escolha o __melhor__ trabalho para **você**:`);
        const row = createRow(new StringSelectMenuBuilder()
            .setCustomId("MenuJobs")
            .setPlaceholder("Escolha um trabalho:")
            .addOptions(Object.keys(jobs).map(i => {
            const job = jobs[i];
            const option = new StringSelectMenuOptionBuilder()
                .setLabel(job.name)
                .setDescription(`Salário: ${FormatSaldo(job.salario)} - Tempo: ${job.tempo} horas.`)
                .setValue(`${i}`)
                .setEmoji(job.emoji);
            return option;
        })));
        await interaction.reply({ embeds: [embed], components: [row] });
    }
});
