
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, User, MapPin } from 'lucide-react';
import { teamDetails } from '@/lib/team-details';
import type { TeamData } from '@/app/teams/page';

interface TeamCardProps {
    team: TeamData;
}

export function TeamCard({ team }: TeamCardProps) {
  const { Constructor, points, position, wins, drivers } = team;
  const details = teamDetails[Constructor.constructorId];

  return (
    <Link href="#" className="flex">
        <Card className="flex flex-col w-full hover:border-primary transition-colors">
        <CardHeader>
            <div className="aspect-video relative mb-4">
            <Image
                src={`https://placehold.co/600x400.png`}
                alt={Constructor.name}
                fill
                className="rounded-lg object-cover"
                data-ai-hint="formula one team car"
            />
            </div>
            <CardTitle className="font-headline text-lg">{Constructor.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between space-y-2 text-sm text-muted-foreground">
            <div className="space-y-2">
                <div className="flex items-center">
                    <Globe className="mr-2 h-4 w-4 text-accent" />
                    <span>{Constructor.nationality}</span>
                </div>
                {details && (
                <>
                    <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-accent" />
                    <span>Team Principal: {details.principal}</span>
                    </div>
                    <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-accent" />
                    <span>Base: {details.base}</span>
                    </div>
                </>
                )}
                <div className="space-y-1 pt-1">
                    {drivers.map(driver => (
                        <div key={driver.driverId} className="flex items-center">
                            <User className="mr-2 h-4 w-4 text-accent" />
                            <span>{`${driver.givenName} ${driver.familyName}`}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="flex flex-col items-center justify-center p-2 rounded-md bg-muted/50">
                    <p className="font-bold text-lg text-foreground">{position}</p>
                    <p className="text-xs text-muted-foreground">Position</p>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-md bg-muted/50">
                    <p className="font-bold text-lg text-foreground">{points}</p>
                    <p className="text-xs text-muted-foreground">Points</p>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-md bg-muted/50">
                    <p className="font-bold text-lg text-foreground">{wins}</p>
                    <p className="text-xs text-muted-foreground">Wins</p>
                </div>
            </div>
        </CardContent>
        </Card>
    </Link>
  );
}
