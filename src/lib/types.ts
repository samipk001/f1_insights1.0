

export interface ErgastResponse<T> {
  MRData: T;
}

export interface StandingsTable {
  season: string;
  StandingsLists: StandingsList[];
}

export interface StandingsList {
  season: string;
  round: string;
  DriverStandings?: DriverStanding[];
  ConstructorStandings?: ConstructorStanding[];
}

export interface DriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
}

export interface ConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: Constructor;
}

export interface Driver {
  driverId: string;
  permanentNumber: string;
  code: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

export interface Constructor {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
}

export interface RaceTable {
    season: string;
    Races: Race[];
}

export interface PitStopTable {
    season: string;
    round: string;
    Races: {
        season: string;
        round: string;
        url: string;
        raceName: string;
        Circuit: Circuit;
        date: string;
        PitStops: PitStop[];
    }[];
}

export interface PitStop {
    driverId: string;
    lap: string;
    stop: string;
    time: string;
    duration: string;
}

export interface Race {
    season: string;
    round: string;
    url: string;
    raceName: string;
    Circuit: Circuit;
    date: string;
    time: string;
    FirstPractice?: PracticeSession;
    SecondPractice?: PracticeSession;
    ThirdPractice?: PracticeSession;
    Qualifying?: PracticeSession;
    Results?: Result[];
    QualifyingResults?: QualifyingResult[];
    laps?: string; // Add laps property here as it's sometimes available
}

export interface Result {
    number: string;
    position: string;
    positionText: string;
    points: string;
    Driver: Driver;
    Constructor: Constructor;
    grid: string;
    laps: string;
    status: string;
    Time?: {
        millis: string;
        time: string;
    };
    FastestLap?: {
        rank: string;
        lap: string;
        Time: {
            time: string;
        };
        AverageSpeed: {
            units: string;
            speed: string;
        };
    };
}

export interface QualifyingResult {
    number: string;
    position: string;
    Driver: Driver;
    Constructor: Constructor;
    Q1?: string;
    Q2?: string;
    Q3?: string;
}


export interface Circuit {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: Location;
}

export interface Location {
    lat: string;
    long: string;
    locality: string;
    country: string;
}

export interface PracticeSession {
    date: string;
    time: string;
}


export interface DriverTable {
  Drivers: Driver[];
}
