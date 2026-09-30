export interface Client {
  id: string
  name: string
  description: string
  unavailable?: boolean
}

export const CLIENTS: Client[] = [
  { id: "asteria-rip", name: "Asteria-rip", description: "PVP Ghost client — amazing 15$ client (1.19.4 – 1.20.1 fabric) (bind F8)" },
  { id: "astroline", name: "Astroline", description: "Universal — setup: 1. unzip 2. put .jar into version 3. start the astroline in launcher as instance" },
  { id: "atani", name: "Atani", description: "Blatant PVP client — setup: 1. download and start .exe (1.8.9) (bind RShift)" },
  { id: "aurora", name: "Aurora", description: "TH recode — Universal client (1.20.4 fabric), -noverify required in args" },
  { id: "bloody-client", name: "Bloody-client", description: "Paid (1.20.1 fabric) skid of Coffee and TH" },
  { id: "dimasik", name: "Dimasik", description: "Skid of russian client — setup: 1. put .jar into version 2. start the client 3. set the args to -noverify (1.16.5)" },
  { id: "evaware", name: "Evaware", description: "SwordHVH + CPVP Vegaline Skid — setup: 1. put .jar into version 2. start the client 3. set the args to -noverify (1.16.5)" },
  { id: "fabuls", name: "Fabuls", description: "Universal client — setup: 1. unzip Fabuls, move client.jar into Fabuls/client folder, run FabulsLauncher.exe (bind RCTRL)" },
  { id: "flap-client", name: "Flap-client", description: "1.8.9 hybrid client", unavailable: true },
  { id: "francium", name: "Francium", description: "CPVP ghost client (1.20.4 fabric)" },
  { id: "goldgrinder", name: "Goldgrinder", description: "300$ hypixel client (1.8.9 forge!)" },
  { id: "gothaj", name: "Gothaj", description: "Number 2 intave AC — setup: 1. put jar into /version 2. start the instance in launcher" },
  { id: "grandline", name: "Grandline", description: "Ghost C/PVP — paid continue of virgin client (1.20.1 fabric)" },
  { id: "grim", name: "Grim", description: "Ass client for lunar — setup: 1. run .exe 2. start MC in lunar with fabric (1.16.5, 1.20.1/4)" },
  { id: "helios", name: "Helios", description: "DMA takedown", unavailable: true },
  { id: "krypton", name: "Krypton", description: "Ghost client with focus on Donut SMP (1.21.1 fabric)" },
  { id: "kvn", name: "Kvn", description: "Oldfag mod for farming (1.12.2 forge!) setup: 1. download and put in /mods with baritone 2. run forge" },
  { id: "litka", name: "Litka", description: "Elytra pvp client (1.16.5) (bind: RShift)" },
  { id: "neverbuy", name: "Neverbuy", description: "RUSSIAN plugin for AH plugins (1.16.5 fabric, !lithium needed)" },
  { id: "nexus", name: "Nexus", description: "Private hybrid client (1.21 fabric) !use -noverify in arguments" },
  { id: "north", name: "North", description: "MCP client (1.8.9) setup: 1. put into /versions 2. run in launcher" },
  { id: "november", name: "November", description: "Paid MCP client (1.8.9) setup: 1. unzip 2. press start-client.bat" },
  { id: "opal", name: "Opal", description: "100$ client (1.20.4 fabric)" },
  { id: "prestige", name: "Prestige client", description: "Ghost CPVP client", unavailable: true },
  { id: "pulse", name: "Pulse", description: "Private blatant CPVP (1.21) (bind: RCTRL)" },
  { id: "ravenb-minus", name: "Ravenb-minus", description: "Ass client (1.8.9 fabric) (use -noverify in JVM args)" },
  { id: "sloth", name: "Sloth", description: "Raven skid, no bypass, command based (1.8.9 fabric)" },
  { id: "rise", name: "Rise", description: "File not available", unavailable: true },
  { id: "thunderhack-deluxe", name: "TH-deluxe", description: "Paid version of TH (1.20.1)" },
  { id: "vegaline", name: "Vegaline", description: "File not available", unavailable: true },
  { id: "virgin", name: "Virgin", description: "Mid paid skidded ghost client for C/PVP (1.21 fabric)" },
  { id: "warden", name: "Warden", description: "1$ Russian blatant Sword PVP — skidded af (1.16.5)" },
]
