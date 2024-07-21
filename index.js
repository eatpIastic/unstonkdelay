/// <reference types="../CTAutocomplete" />

import Dungeon from "../BloomCore/Dungeons/Dungeon";
import PogObject from "../PogData";

const data = new PogObject("unstonkdelay", {
  "toggled": true,
  "ping": 50,
}, "settings.json");

register("blockBreak", (block) => {
  if(!data.toggled) return;
  if (!Dungeon.inDungeon) return;
  if(block?.getType()?.getRegistryName()?.includes("melon")) return;
  breakBlock(block.getX(), block.getY(), block.getZ());
});

function breakBlock(x, y, z) {
  if(!Player.getInventory()?.getItems()[slot]?.getRegistryName()?.includes("pickaxe")) return;

  let numPicks = 0;
  let inv = Player.getInventory()?.getItems();
  for(let i=0; i<9; i++) {
    if(inv[i]?.getRegistryName()?.includes("pickaxe")) numPicks++;
  }
  if(numPicks>1) return;

  let block = new net.minecraft.util.BlockPos(x, y, z)
  let blockstate = World.getBlockAt(x, y, z).getState();
  setTimeout( () => {
    World.getWorld().func_175656_a(block, blockstate);
  }, data.ping);
}


const C09PacketHeldItemChange = Java.type("net.minecraft.network.play.client.C09PacketHeldItemChange");
let slot = 0;
register("packetSent", (packet, event) => {
  slot = packet.func_149614_c();
}).setFilteredClass(C09PacketHeldItemChange);


register("command", (...args) => {
  if(!args?.[0]) {
    ChatLib.chat(`&cunstonkdelay:\n&b/usd toggle (${data.toggled})\n&b/usd ping # (currently: ${data.ping}) (default 50)`);
  } else if(args[0] == "toggle") {
    data.toggled = !data.toggled;
    data.save();
    ChatLib.chat(`&cunstonkdelay ${data.toggled ? "enabled" : "disabled"}`);
  } else if(args[0] == "ping") {
    data.ping = args[1];
    data.save();
    ChatLib.chat(`&cunstonkdelay ping set to ${data.ping}`);
  }
}).setName("usd");
