import { ResponderType, Responder } from "#base";
import { FirebaseCruds } from "#database";
import { Embed, FormatSaldo, inCooldown } from "#functions";
import { settings } from "#settings";
import { ColorResolvable, EmbedBuilder } from "discord.js";

new Responder({
  customId: "ButtonSendPix/:valuePix/:userReciveId/:AuthorId",
  type: ResponderType.Button,
  cache: "cached",
  async run(interaction, { valuePix, userReciveId, AuthorId }) {
    if (await inCooldown(interaction)) return;

    const numberValuePix = Number(valuePix);
    const Author = interaction.user;
    const AuthorData = await FirebaseCruds.get(`users/${AuthorId}`);
    const UserData = await FirebaseCruds.get(`users/${userReciveId}`);
    const userRecivePix = await interaction.client.users.fetch(userReciveId);

    if (Author.id != AuthorId) {
      await interaction.update({
        components: [],
        embeds: [
          Embed(interaction)
            .setColor(settings.colors.danger as ColorResolvable)
            .setDescription(
              `${settings.emojis.error} ${Author} você não é o author desse comando!`
            ),
        ],
      });

      return;
    } else if (AuthorData.userDetails!.saldo.bank < numberValuePix) {
      await interaction.update({
        components: [],
        embeds: [
          Embed(interaction).setDescription(
            `${
              settings.emojis.error
            } ${Author}, você não possuí \`${FormatSaldo(
              numberValuePix
            )}\` em sua carteira!`
          ),
        ],
      });
      return;
    }

    AuthorData.userDetails!.saldo.bank -= numberValuePix;
    UserData.userDetails!.saldo.bank += numberValuePix;

    await FirebaseCruds.set(`users/${Author.id}`, AuthorData);
    await FirebaseCruds.set(`users/${userReciveId}`, UserData);

    await interaction.update({
      components: [],
      embeds: [
        Embed(interaction)
          .setColor(settings.colors.success as ColorResolvable)
          .setDescription(
            `${settings.emojis.success} ${Author}, o pix foi __enviado__ com **sucesso**!\nEnviamos mais __detalhes__ na **DM**.`
          ),
      ],
    });

    const now = new Date();
    const data = `${now.getDate().toString().padStart(2, "0")}/${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${now.getFullYear()}`;
    const hours = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const DmEmbed: EmbedBuilder = Embed(interaction).setFields([
      {
        name: `${settings.emojis.dinheiro} Valor:`,
        value: `\`\`\`${FormatSaldo(numberValuePix)}\`\`\``,
        inline: true,
      },
      {
        name: `${settings.emojis.time} Data - Hora:`,
        value: `\`\`\`${data} - ${hours}\`\`\``,
        inline: true,
      },
    ]);
    Author.send({
      content: `# ${Author}, você enviou um pix para ${userRecivePix.displayName} (\`${userRecivePix.id}\`).\n## Detalhes abaixo:`,
      embeds: [DmEmbed],
    });
    userRecivePix.send({
      content: `# ${userRecivePix}, você recebeu um pix de ${Author.displayName} (\`${Author.id}\`).\n## Detalhes abaixo:`,
      embeds: [DmEmbed],
    });
  },
});

new Responder({
    customId: "ButtonCancelPix",
    type: ResponderType.Button, cache: "cached",
    async run(interaction) {
        const messageUpdate = await interaction.update({
            components: [],
            embeds: [Embed(interaction).setDescription(`${settings.emojis.success} O pix foi cancelado com sucesso!`)]
        });
        setTimeout(()=>{
            messageUpdate.delete();
        }, 1000 * 25);
    },
});