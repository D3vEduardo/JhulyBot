import { jobs } from "#assets";
import { Event } from "#base";
import { database } from "#database";
import { FormatSaldo } from "#functions";
import { settings } from "#settings";
import { codeBlock, ColorResolvable, EmbedBuilder } from "discord.js";

new Event({
    name: "Verifando os users trabalhando",
    event: "ready",
    async run(client) {
        setInterval(async () => {
            const users = client.users.cache;

            const updatePromisses = users.map(async user => {
                if ( client.user.id ===  user.id ) return;

                const userData = await database.read(user.id);
                const userStatusJob = userData.userDetails.status.find(i => i.name === "job");

                if ( !userStatusJob || userStatusJob.expire > Date.now() ) return;

                const userJob = jobs[userStatusJob.data as keyof typeof jobs];
                userData.userDetails.status = userData.userDetails.status.filter(i => i.name != "job");
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
                        },
                        {
                            name: `${time} Expediente:`,
                            value: codeBlock(`${userJob.tempo} horas`),
                            inline: true
                        }
                    ])
                    .setFooter({ text: `JhulyBot ${settings.version}`, iconURL: user.displayAvatarURL() })
                    .setThumbnail(user.displayAvatarURL())
                    .setColor(settings.colors.caramel as ColorResolvable);

                await user.send({ embeds: [embed] });
            });

            await Promise.all(updatePromisses);
        }, 5000 * 60);
    }
});