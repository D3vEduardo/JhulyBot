import { Event } from "#base";
import { database, iBadges } from "#database";
import { settings } from "#settings";

new Event({
  name: "Set Badges",
  event: "interactionCreate",
  async run(interaction) {
    const Author = interaction.user;
    const AuthorData = await database.read(Author.id);
    AuthorData.userDetails.badges = Array.isArray(AuthorData.userDetails.badges) ? AuthorData.userDetails.badges : [];
    const Badges = AuthorData.userDetails.badges;
    const PlayedBetaBadge = Badges.find((i: iBadges) => i.name === "Played the BETA");

    if (!PlayedBetaBadge) {
      AuthorData.userDetails.badges.push({
        emoji: "<:playedbeta:1251334812598403093>",
        name: "Played the BETA",
        src: "BadgePlayedBeta",
      });

      await database.write(Author.id, AuthorData);

      await Author.send({
        content: `${settings.emojis.confete1} ${Author}, você recebeu a badge <:playedbeta:1251334812598403093>\`Played the BETA\`!`,
      });
    }

    return;
  },
});
