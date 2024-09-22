import { Command } from "#base";
import { database, iStatus, iUser } from "#database";
import { Embed, FormatSaldo, inCooldown } from "#functions";
import { settings } from "#settings";
import { jobs } from "#assets";
import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ApplicationCommandType,
  time,
  User,
  codeBlock,
} from "discord.js";
import { createRow } from "@magicyan/discord";

new Command({
  name: "trabalhar",
  description: "Trabalhe para receber JhulyBucks!",
  dmPermission: true,
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
    if (await inCooldown(interaction)) return;

    const author: User = interaction.user;
    const authorData: iUser = await database.read(interaction.user.id);

    const authorJob: iStatus | undefined | null = authorData.userDetails.status
      ? authorData.userDetails.status.find((i: iStatus) => i.name === "job")
      : null;

    if (
      authorJob &&
      "name" in authorJob &&
      "expire" in authorJob &&
      authorJob.expire > Date.now()
    ) {
      await interaction.reply({
        embeds: [
          Embed(interaction).setDescription(
            `${
              settings.emojis.error
            } ${author}, você ainda está trabalhando como \`${
              jobs[authorJob.data as keyof typeof jobs].name
            }\`. Seu expediente terminará ${time(
              Math.floor(authorJob.expire / 1000),
              "R"
            )}.`
          ),
        ],
      });
      return;
    }

    if (
      authorJob &&
      "name" in authorJob &&
      "expire" in authorJob &&
      "data" in authorJob &&
      authorJob.expire < Date.now()
    ) {
      const jobSelected = jobs[authorJob.data as keyof typeof jobs];
      authorData.userDetails.saldo.bank += jobSelected.salario;
      authorData.userDetails.status = authorData.userDetails.status.filter(
        (i) => i.name != "job"
      );

      await database.write(author.id, authorData);

      const { job, time, dinheiro } = settings.emojis;

      await author.send({
        embeds: [
          Embed(interaction)
            .setTitle(`${job} Trabalho concluído`)
            .setDescription(
              `O seu __expediente__ como ${jobSelected.emoji}\`${jobSelected.name}\` **terminou**!\nConfira os __detalhes__ **abaixo**:`
            )
            .setFields([
              {
                name: `${dinheiro} Salário:`,
                value: `${codeBlock(FormatSaldo(jobSelected.salario))}`,
                inline: true,
              },
              {
                name: `${time} Expediente:`,
                value: codeBlock(`${jobSelected.tempo} horas`),
                inline: true,
              },
            ]),
        ],
      });
    }
    const embed = Embed(interaction)
      .setTitle(`${settings.emojis.job} Trabalhar`)
      .setDescription(
        `${author}, escolha o __melhor__ trabalho para **você**:`
      );

    const row = createRow(
      new StringSelectMenuBuilder()
        .setCustomId("MenuJobs")
        .setPlaceholder("Escolha um trabalho:")
        .addOptions(
          Object.keys(jobs).map((i) => {
            const job = jobs[i as keyof typeof jobs];

            const option = new StringSelectMenuOptionBuilder()
              .setLabel(job.name)
              .setDescription(
                `Salário: ${FormatSaldo(job.salario)} - Tempo: ${
                  job.tempo
                } horas.`
              )
              .setValue(`${i}`)
              .setEmoji(job.emoji);

            return option;
          })
        )
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
});
