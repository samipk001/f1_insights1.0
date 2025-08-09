
export interface TeamDetails {
  principal: string;
  base: string;
  history: string;
  drivers: string[];
}

export const teamDetails: Record<string, TeamDetails> = {
  ferrari: {
    principal: "Frédéric Vasseur",
    base: "Maranello, Italy",
    history: "Scuderia Ferrari is the oldest surviving and most successful Formula One team, having competed in every world championship since the 1950 season.",
    drivers: ["Charles Leclerc", "Carlos Sainz"],
  },
  mclaren: {
    principal: "Andrea Stella",
    base: "Woking, United Kingdom",
    history: "Founded by New Zealander Bruce McLaren in 1963, McLaren is one of the most successful teams in F1 history, second only to Ferrari.",
    drivers: ["Lando Norris", "Oscar Piastri"],
  },
  mercedes: {
    principal: "Toto Wolff",
    base: "Brackley, United Kingdom",
    history: "Mercedes-Benz has a rich history in motorsport. The modern works team has been highly successful, winning multiple consecutive constructors' and drivers' championships.",
    drivers: ["Lewis Hamilton", "George Russell"],
  },
  red_bull: {
    principal: "Christian Horner",
    base: "Milton Keynes, United Kingdom",
    history: "Owned by beverage company Red Bull GmbH, the team has been a dominant force in F1, known for its strong aerodynamics and engineering.",
    drivers: ["Max Verstappen", "Sergio Pérez"],
  },
  williams: {
    principal: "James Vowles",
    base: "Grove, United Kingdom",
    history: "One of the most iconic teams in F1, Williams has a long history of success, founded by Sir Frank Williams and Sir Patrick Head.",
    drivers: ["Alexander Albon", "Logan Sargeant"],
  },
  aston_martin: {
    principal: "Mike Krack",
    base: "Silverstone, United Kingdom",
    history: "The Aston Martin name returned to F1 in 2021, taking over the former Racing Point team. The team has a growing presence and ambition.",
    drivers: ["Fernando Alonso", "Lance Stroll"],
  },
  alpine: {
    principal: "Bruno Famin",
    base: "Enstone, United Kingdom",
    history: "Owned by the French automotive company Renault, the team races under the Alpine brand. Its roots go back to the Toleman and Benetton teams.",
    drivers: ["Pierre Gasly", "Esteban Ocon"],
  },
  haas: {
    principal: "Ayao Komatsu",
    base: "Kannapolis, United States",
    history: "The only American-owned team on the grid, Haas F1 Team made its debut in 2016.",
    drivers: ["Kevin Magnussen", "Nico Hülkenberg"],
  },
  rb: {
    principal: "Laurent Mekies",
    base: "Faenza, Italy",
    history: "Formerly known as Scuderia Toro Rosso and AlphaTauri, the team serves as the junior team to Red Bull Racing.",
    drivers: ["Yuki Tsunoda", "Daniel Ricciardo"],
  },
  sauber: {
    principal: "Alessandro Alunni Bravi",
    base: "Hinwil, Switzerland",
    history: "Founded by Peter Sauber, the team has a long history of competing in F1, often in partnership with major manufacturers like BMW and Alfa Romeo.",
    drivers: ["Valtteri Bottas", "Zhou Guanyu"],
  },
};
