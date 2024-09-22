import { Responder, ResponderType } from "#base";
import { database } from "#database";
import { Embed, FormatSaldo, inCooldown } from "#functions";
import { settings } from "#settings";
import { createRow } from "@magicyan/discord";
import {
  ButtonBuilder,
  ButtonStyle,
  ColorResolvable,
  EmbedBuilder,
} from "discord.js";

new Responder({
  customId: "ModalPix",
  type: ResponderType.ModalComponent,
  cache: "cached",
  async run(interaction) {
    if (await inCooldown(interaction)) return;

    const userIdRecivePix = interaction.fields.getTextInputValue("UserPix");
    const valueStringPix = interaction.fields.getTextInputValue("ValuePix");
    const valueNumberPix = Number(valueStringPix);
    const Author = interaction.user;
    const AuthorData = await database.read(Author.id);
    let UserRecivePix;
    try {
      UserRecivePix = await interaction.client.users.fetch(userIdRecivePix);
    } catch {
      await interaction.update({
        embeds: [
          Embed(interaction)
            .setColor(settings.colors.danger as ColorResolvable)
            .setDescription(
              `${settings.emojis.error} ${Author}, chave pix inválida!`
            ),
        ],
        components: [],
      });
      return;
    }

    if ( UserRecivePix.bot || UserRecivePix.id == Author.id ) {
      await interaction.reply({ components: [], embeds: [Embed(interaction).setDescription("A chave pix informada é invalida!")] });
      return;
    } 

    if (isNaN(valueNumberPix) || valueNumberPix <= 0) {
      await interaction.update({
        embeds: [
          Embed(interaction)
            .setColor(settings.colors.danger as ColorResolvable)
            .setDescription(
              `${settings.emojis.error} ${Author}, o **valor** da __transferência__ pix não é um __número__ **válido**!`
            ),
        ],
        components: [],
      });
      return;
    } else if (valueNumberPix > AuthorData.userDetails!.saldo.bank) {
      await interaction.update({
        embeds: [
          Embed(interaction)
            .setColor(settings.colors.danger as ColorResolvable)
            .setDescription(
              `${
                settings.emojis.error
              } ${Author}, você **não** possuí \`${FormatSaldo(
                valueNumberPix
              )}\` em sua conta __JhulyBank__!`
            ),
        ],
        components: [],
      });
      return;
    }

    const row = createRow(
      new ButtonBuilder()
        .setCustomId(
          `ButtonSendPix/${valueNumberPix}/${UserRecivePix.id}/${
            Author.id
          }`
        )
        .setLabel("Enviar pix")
        .setEmoji(settings.emojis.success)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("ButtonCancelPix")
        .setLabel("Cancelar pix")
        .setEmoji(settings.emojis.error)
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({
      components: [row],
      embeds: [
        Embed(interaction)
          .setColor(settings.colors.warning as ColorResolvable)
          .setDescription(
            `${
              settings.emojis.warning
            } ${Author} você **realmente** deseja enviar um __pix__ no valor de \`${FormatSaldo(
              valueNumberPix
            )}\` para \`${UserRecivePix.displayName} (${
              (
                UserRecivePix
              ).id
            })\`?`
          ),
      ],
    });
  },
});

new Responder({
  customId: "ModalDepósitar",
  type: ResponderType.ModalComponent,
  cache: "cached",
  async run(interaction) {
    if (await inCooldown(interaction)) return;

    const Author = interaction.user;
    const AuthorData = await database.read(Author.id);
    const valueStringDep =
      interaction.fields.getTextInputValue("ValueDepositar");
    const valueNumberDep = Number(valueStringDep);

    if (isNaN(valueNumberDep) || valueNumberDep <= 0) {
      await interaction.update({
        components: [],
        embeds: [
          Embed(interaction).setDescription(
            `${settings.emojis.error} ${Author}, \`${valueStringDep}\` não é um número válido!`
          ),
        ],
      });
      return;
    } else if (AuthorData.userDetails!.saldo.carteira < valueNumberDep) {
      await interaction.update({
        components: [],
        embeds: [
          Embed(interaction)
            .setDescription(
              `${
                settings.emojis.error
              } ${Author}, você não possuí \`${FormatSaldo(
                valueNumberDep
              )}\` em sua conta JhulyBank.`
            )
            .setColor(settings.colors.danger as ColorResolvable),
        ],
      });
      return;
    }

    AuthorData.userDetails!.saldo.bank += valueNumberDep;
    AuthorData.userDetails!.saldo.carteira -= valueNumberDep;

    await database.write(Author.id, AuthorData);

    await interaction.update({
      components: [],
      embeds: [
        Embed(interaction)
          .setColor(settings.colors.success as ColorResolvable)
          .setDescription(
            `${settings.emojis.success} O __depósito__ foi realizado com **sucesso**!\nEnviamos mais __detalhes__ na **DM**.`
          ),
      ],
    });

    const now = new Date();
    const hours = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const data = `${now.getDate().toString().padStart(2, "0")}/${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${now.getFullYear()}`;

    const DmEmbed: EmbedBuilder = Embed(interaction)
      .setDescription("Detalhes do **depósito**:")
      .setFields([
        {
          name: `${settings.emojis.dinheiro} Valor:`,
          value: `\`\`\`${FormatSaldo(valueNumberDep)}\`\`\``,
          inline: true,
        },
        {
          name: `${settings.emojis.time} Data - Hora:`,
          value: `\`\`\`${data} - ${hours}\`\`\``,
          inline: true,
        },
      ]);

    await Author.send({ embeds: [DmEmbed] });
  },
});

new Responder({
  customId: "ModalSacar",
  type: ResponderType.ModalComponent,
  cache: "cached",
  async run(interaction) {
    if (await inCooldown(interaction)) return;
    const Author = interaction.user;
    const AuthorData = await database.read(Author.id);
    const stringValueSaque = interaction.fields.getTextInputValue("ValueSaque");
    const numberValueSaque = Number(stringValueSaque);

    if (isNaN(numberValueSaque) || numberValueSaque <= 0) {
      await interaction.update({
        components: [],
        embeds: [
          Embed(interaction)
            .setDescription(
              `${settings.emojis.error} ${Author}, \`${stringValueSaque}\` não é um número válido!`
            )
            .setColor(settings.colors.danger as ColorResolvable),
        ],
      });
      return;
    } else if (AuthorData.userDetails!.saldo.bank < numberValueSaque) {
      await interaction.update({
        components: [],
        embeds: [
          Embed(interaction)
            .setDescription(
              `${
                settings.emojis.error
              } ${Author}, você não possuí \`${FormatSaldo(
                numberValueSaque
              )}\` em sua conta JhulyBank.`
            )
            .setColor(settings.colors.danger as ColorResolvable),
        ],
      });
      return;
    }

    AuthorData.userDetails!.saldo.bank -= numberValueSaque;
    AuthorData.userDetails!.saldo.carteira += numberValueSaque;
    await database.write(Author.id, AuthorData);

    await interaction.update({
      components: [],
      embeds: [
        Embed(interaction)
          .setColor(settings.colors.success as ColorResolvable)
          .setDescription(
            `${settings.emojis.success} ${Author}, o __saque__ foi **concluído** com sucesso!\nTe enviamos mais __detalhes__ na **DM**.`
          ),
      ],
    });

    const now = new Date();
    const data = `${now.getDate().toString().padStart(2, "0")}/${now
      .getMonth()
      .toString()
      .padStart(2, "0")}/${now.getFullYear()}`;
    const hours = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    Author.send({
      embeds: [
        Embed(interaction)
          .setDescription("Detalhes do **saque**:")
          .setFields([
            {
              name: `${settings.emojis.dinheiro} Valor:`,
              value: `\`\`\`${FormatSaldo(numberValueSaque)}\`\`\``,
              inline: true,
            },
            {
              name: `${settings.emojis.time} Data - Hora:`,
              value: `\`\`\`${data} - ${hours}\`\`\``,
              inline: true,
            },
          ]),
      ],
    });
  },
});
