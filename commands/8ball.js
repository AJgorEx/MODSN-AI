const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Odpowiada na pytania tak/nie')
    .addBooleanOption(o =>
      o.setName('prywatnie')
        .setDescription('Wyświetl odpowiedź prywatnie')
    )
    .addStringOption(option =>
      option.setName('pytanie')
        .setDescription('Treść pytania')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('nastawienie')
        .setDescription('Rodzaj odpowiedzi')
        .addChoices(
          { name: 'Pozytywna', value: 'positive' },
          { name: 'Neutralna', value: 'neutral' },
          { name: 'Negatywna', value: 'negative' }
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    const ephemeral = interaction.options.getBoolean('prywatnie') ?? false;
    const mood = interaction.options.getString('nastawienie') || 'all';
    const question = interaction.options.getString('pytanie');

    const responses = {
      positive: [
        'Na pewno',
        'Zdecydowanie tak',
        'Bez wątpienia',
        'Tak, zdecydowanie',
        'Możesz na to liczyć',
        'Według mnie tak',
        'Najprawdopodobniej',
        'Wygląda dobrze',
        'Tak',
        'Wszystko wskazuje na tak'
      ],
      neutral: [
        'Odpowiedź niewyraźna, spróbuj ponownie',
        'Zapytaj ponownie później',
        'Lepiej nie mówić teraz',
        'Nie mogę teraz przewidzieć',
        'Skup się i zapytaj ponownie'
      ],
      negative: [
        'Nie licz na to',
        'Moja odpowiedź brzmi nie',
        'Moje źródła mówią nie',
        'Perspektywa niezbyt dobra',
        'Bardzo wątpliwe'
      ]
    };
    responses.all = [...responses.positive, ...responses.neutral, ...responses.negative];

    const pool = responses[mood] || responses.all;
    const response = pool[Math.floor(Math.random() * pool.length)];
    const embed = interaction.client.createEmbed(interaction.guildId, {
      title: 'Magic 8-Ball',
      description: `**Pytanie:** ${question}\n**Odpowiedź:** ${response}`
    });
    await interaction.reply({ embeds: [embed], ephemeral });
  }
};
