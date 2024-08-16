import { jobs } from "#assets";
import { Event } from "#base";
import { database } from "#database";
import { FormatSaldo } from "#functions";
import { settings } from "#settings";
import { codeBlock, EmbedBuilder } from "discord.js";
new Event({
    name: "Verifando os users trabalhando",
    event: "ready",
    async run(interaction) {
        setInterval(() => {
            const users = interaction.users.cache;
            users.forEach(async (user) => {
                const userData = await database.read(user.id);
                if (user.id === interaction.user.id || !userData.userDetails.status)
                    return;
                const userJobStatus = userData.userDetails.status.find((i) => i.name === "job");
                if (userJobStatus && userJobStatus.expire > Date.now())
                    return; // ? Caso o user não tenha terminado de trabalhar
                // ? Caso o user tenha terminado de trabalhar
                const userJob = jobs[userJobStatus.data];
                userData.userDetails.status = userData.userDetails.status.filter((i) => i.name != "job");
                userData.userDetails.saldo.bank += userJob.salario;
                await database.write(user.id, userData);
                const { job, time, dinheiro } = settings.emojis;
                const embed = new EmbedBuilder()
                    .setTitle(`${job} Trabalho concluído`)
                    .setDescription(`O seu __expediente__ como ${userJob.emoji}\`${userJob.name}\` **terminou**!\nConfira os __detalhes__ **abaixo**:`)
                    .setFields([
                    {
                        name: `${dinheiro} Salário:`,
                        value: `${codeBlock(FormatSaldo(userJob.salario))}`,
                        inline: true
                    }, {
                        name: `${time} Expediente:`,
                        value: codeBlock(`${userJob.tempo} horas`),
                        inline: true
                    }
                ])
                    .setFooter({ text: `JhulyBot ${settings.version}`, iconURL: user.displayAvatarURL() })
                    .setThumbnail(user.displayAvatarURL())
                    .setColor(settings.colors.caramel);
                user.send({ embeds: [embed] }); // ! FECHAMENTO DO user.send
            }); // ! FECHAMENTO DO users.forEach
        }, 3 * 1000 * 60);
    }
});
