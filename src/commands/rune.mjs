import {
	ActionRowBuilder,
	SlashCommandBuilder,
	EmbedBuilder,
    EmbedAssertions,
} from 'discord.js';
import { JSDOM } from 'jsdom';
import { findRune } from '../modules/nameFinders.mjs';

export const informaton = {
    name: 'rune',
    description: 'Gets the information for a rune / rune tree from the wiki'
};

export default {
    data: new SlashCommandBuilder()
            .setName(`${informaton.name}`)
            .setDescription(`${informaton.description}`)
            .addStringOption((option) => {
                option.setName('rune')
                      .setDescription('Rune / Rune tree Name')
                      .setRequired(true)      
                return option;
            })
    , async execute (interaction, channel) {

        let rtnEmbeds = [];
        let embed = new EmbedBuilder();

        await interaction.deferReply();

        try {
        let ref = {isRune: true};
        let givenRune = interaction.options.getString('rune');
        let rune = await findRune(givenRune, ref);
        
        if (rune === undefined) {
            embed.setTitle('**Error getting rune or rune tree**');
            rtnEmbeds.push(embed);
            await interaction.editReply({embeds: rtnEmbeds});
            return;
        } if (rune === null) {
            embed.setTitle('**Rune or rune tree not found**');
            rtnEmbeds.push(embed);
            await interaction.editReply({embeds: rtnEmbeds});
            return;
        }
    
        if (!ref.isRune) {
            const treeDescriptions = {precision: 'Improved attacks and sustained damage.',
                                    domination: 'Burst damage and target access.',
                                    sorcery: 'Empowered abilities and resource manipulation.',
                                    inspiration: 'Creative tools and rule bending.',
                                    resolve: 'Durability and crowd control.'};
            
            const url = `https://leagueoflegends.fandom.com/api.php?action=parse&text={{Rune%20path%20infobox/${rune.name}}}&contentmodel=wikitext&format=json`;
            const request = await fetch(url).catch(err => {console.log(err);});
            const body = await request.json();
            let dom = new JSDOM(body.parse.text['*'], {contentType: 'text/html'});
            let document = dom.window.document;

            embed.setTitle(rune.name);
            embed.setThumbnail(`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`);
            embed.setDescription(`_${treeDescriptions[rune.name.toLowerCase()] || ''}_`)

            let index = 0;
            while (document.getElementsByClassName('pi-item pi-header pi-secondary-font pi-item-spacing pi-secondary-background')[index] !== undefined && document.getElementsByClassName(`pi-smart-group-body pi-border-color`)[index] !== undefined && document.getElementsByClassName(`pi-smart-group-body pi-border-color`)[index].textContent.trim()) {
                embed.addFields({name: document.getElementsByClassName('pi-item pi-header pi-secondary-font pi-item-spacing pi-secondary-background')[index].textContent, value: document.getElementsByClassName(`pi-smart-group-body pi-border-color`)[index].textContent.trim().replace(/\n/g, ' ').replace(/ {2,}/g, ', ')})
                index++;
            }

            rtnEmbeds.push(embed);
            interaction.editReply({embeds: rtnEmbeds});
            return;
        } else {
            const url = `https://leagueoflegends.fandom.com/api.php?action=parse&text={{rune%20header|${rune.name}}}&contentmodel=wikitext&format=json`;
            const request = await fetch(url).catch(err => {console.error(err);});
            const body = await request.json();
            let dom = new JSDOM(body.parse.text['*'], {contentType: 'text/html'});
            let document = dom.window.document;

            if(document.getElementsByClassName('pi-item pi-data pi-item-spacing pi-border-color')[0] === undefined) {
                embed.setTitle('**Error getting rune or rune tree**');
                rtnEmbeds.push(embed);
                await interaction.editReply({embeds: rtnEmbeds});
                return;
            }

            embed.setTitle(`**${rune.name}**`);
            embed.setThumbnail(`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`);
            
            let index = 0;
            while ( document.getElementsByClassName('pi-item pi-data pi-item-spacing pi-border-color')[index + 1] !== undefined) {
                embed.addFields({name: '​', value: document.getElementsByClassName('pi-item pi-data pi-item-spacing pi-border-color')[index].textContent});
                index++;
            }

            rtnEmbeds.push(embed);
            interaction.editReply({embeds: rtnEmbeds});
            return;
        }
    } catch (error) {
        console.error(error);
        embed.setTitle('**Error getting rune or rune tree**');
        rtnEmbeds.push(embed);
        interaction.editReply({embeds: rtnEmbeds});
        return;
    }
    }
};