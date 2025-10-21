import { PlayerStats as PlayerStatsType } from '../types/types';

interface PlayerStatsProps {
    playerStats: Record<string, PlayerStatsType>;
}

export const PlayerStats = ({playerStats}: PlayerStatsProps) => {
    const players = Object.keys(playerStats);
    if (players.length === 0) return null;
    return <div style={{ marginTop: '30px' }}>
        <h3>Kill Details 🔎</h3>
        {Object.entries(playerStats)
            .filter(([, stats]) => stats.kills > 0)
            .sort(([, a], [, b]) => b.kills - a.kills)
            .map(([player, stats]) => (
                <div key={player} style={{ marginBottom: '15px' }}>
                    <h4 style={{ margin: '0 0 5px 0' }}>{player}</h4>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {Object.entries(stats.killBreakdown)
                            .sort(([, a], [, b]) => b - a)
                            .map(([victim, count]) => (
                                <li key={victim}>
                                    Killed <strong>{victim}</strong> {count} {count > 1 ? 'times' : 'time'}
                                </li>
                            ))}
                    </ul>
                    <h5 style={{ margin: '10px 0 5px 0' }}>{player} weapon stats:</h5>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {Object.entries(stats.weaponKillsBreakdown)
                            .sort(([, a], [, b]) => b - a)
                            .map(([weapon, count]) => (
                                <li key={weapon}>
                                    {weapon}: <strong>{count}</strong> {count > 1 ? 'kills' : 'kill'}
                                </li>
                            ))}
                    </ul>
                </div>
            ))
        }
    </div>
}