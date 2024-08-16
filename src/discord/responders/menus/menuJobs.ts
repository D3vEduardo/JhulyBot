import { Responder, ResponderType } from "#base";
import { database, iStatus } from "#database";
import { Embed, FormatSaldo, inCooldown } from "#functions";
import { settings } from "#settings";
import { time } from "discord.js";
import { jobs } from "#assets";

new Responder({
    customId: "MenuJobs",
    type: ResponderType.StringSelect, cache: "cached",
    async run(interaction) {

        if ( await inCooldown(interaction) ) return;

        const author = interaction.user;
        const authorData = await database.read(author.id);
        const authorJob = authorData.userDetails.status ? authorData.userDetails.status.find((i: iStatus) => i.name === "job" ) : [];
        const keyJob = interaction.values[0] as keyof typeof jobs;
        const jobSelected = jobs[keyJob];


        if (authorJob && "name" in authorJob && "expire" in authorJob && authorJob.expire > Date.now() ) {

            await interaction.reply({ 
                embeds: [ Embed(interaction).setDescription(`${settings.emojis.error} ${author}, você ainda está trabalhando como \`${jobs[authorJob.data as keyof typeof jobs].name}\`. Seu expediente terminará ${time(Math.floor(authorJob.expire/1000), "R")}.`) ]
             });
             return;
        }

        const embed = Embed(interaction)
        .setTitle(`${settings.emojis.job} Trabalho selecionado!`)
        .setDescription(`${author}, você selecionou o trabalho ${jobSelected.emoji}\`${jobSelected.name}\` e irá trabalhar durante \`${jobSelected.tempo}\` horas para receber \`${FormatSaldo(jobSelected.salario)}\`.`);

        const tempoEmMilissegundos = jobSelected.tempo * 60 * 60 * 1000;
        const expire = Date.now() + tempoEmMilissegundos;

        if (authorData.userDetails.status && authorData.userDetails.status.length > 0) {
        authorData.userDetails.status.push({
            name: "job",
            expire: expire,
            data: keyJob
        });
    } else {
        authorData.userDetails.status = [{
            name: "job",
            expire: expire,
            data: keyJob
        }];
    }

        await database.write(author.id, authorData);

        await interaction.reply({ embeds: [embed] });

    },
});