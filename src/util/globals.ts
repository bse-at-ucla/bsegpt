import { EmbedBuilder } from 'discord.js';
import { HexCodes } from "./enum";

interface ProjectGlobals {
	OFFLINE_EMBED: EmbedBuilder;
	OWNER_ID: string;
	PERMISSIONS_EMBED: EmbedBuilder;
}

const OFFLINE_EMBED = new EmbedBuilder()
	.setTitle(`Undergoing Maintenance`)
	.setDescription(`Sorry! We're fixing up our bot to ensure everything works smoothly. Look for an annoucement regarding the downtime.`)
	.setColor(HexCodes.Orange)
	.setTimestamp();

const PERMISSIONS_EMBED = new EmbedBuilder()
	.setTitle(`Invalid Permissions`)
	.setDescription(`You do not have the required permissions to run this command!`)
	.setColor(HexCodes.Red)
	.setTimestamp();

export const globals: ProjectGlobals = {
	OFFLINE_EMBED: OFFLINE_EMBED,
	OWNER_ID: '1026716424409993288',
	PERMISSIONS_EMBED: PERMISSIONS_EMBED,
}