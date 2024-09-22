import { Responder, ResponderType } from "#base";
import { database, iStatus, iUser } from "#database";
import { Embed, FormatSaldo, inCooldown } from "#functions";
import { settings } from "#settings";
import { codeBlock, time } from "discord.js";
import { jobs } from "#assets";

new Responder({
    customId: "MenuJobs",
    type: ResponderType.StringSelect, 
    cache: "cached",
    async run(interaction) {

        if (await inCooldown(interaction)) return;

        const author = interaction.user;
        const authorData: iUser = await database.read(author.id);

        authorData.userDetails.status = Array.isArray(authorData.userDetails.status) ? authorData.userDetails.status : [];

        const authorJob = authorData.userDetails.status.find((i: iStatus) => i.name === "job");
        const keyJob = interaction.values[0] as keyof typeof jobs;
        const jobSelected = jobs[keyJob];

        if (authorJob && authorJob.expire > Date.now()) {
            await interaction.reply({
                embeds: [Embed(interaction).setDescription(`${settings.emojis.error} ${author}, você ainda está trabalhando como \`${jobs[authorJob.data as keyof typeof jobs].name}\`. Seu expediente terminará ${time(Math.floor(authorJob.expire / 1000), "R")}.`)]
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
            .setTitle(`${settings.emojis.job} Trabalho selecionado!`)
            .setDescription(`${author}, você selecionou o trabalho ${jobSelected.emoji}\`${jobSelected.name}\` e irá trabalhar durante \`${jobSelected.tempo}\` horas para receber \`${FormatSaldo(jobSelected.salario)}\`.`);

        const tempoEmMilissegundos = jobSelected.tempo * 60 * 60 * 1000;
        const expire = Date.now() + tempoEmMilissegundos;

        authorData.userDetails.status.push({
            name: "job",
            expire: expire,
            data: keyJob
        });

        await database.write(author.id, authorData);

        await interaction.reply({ embeds: [embed] });
    },
});
