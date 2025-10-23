import { useState } from 'react';
import { PlayerStats } from '../types/types';

interface PlayerTableProps {
    playerStats: Record<string, PlayerStats>;
}

export const PlayerTable = ({playerStats}: PlayerTableProps) => {
    const [orderBy, setOrderBy] = useState< 'kills' | 'deaths' | 'suicides' | 'grenadeKills' | 'telefrags' | 'kdr' | 'eventStreak' | 'headHunter' | 'looseHunter' | 'blasterKills'>('kills') ;

    let data = Object.entries(playerStats).sort(([, a], [, b]) => b.kills - a.kills || a.deaths - b.deaths)
    if (data.length === 0) return null;
    const playerWithMostKills = data[0][0];
    const playerWithMostDeaths = data.sort(([, a], [, b]) => b.deaths - a.deaths)[0][0];
    data = data.map(([player, stats]) => [player, {
        ...stats,
        kdr: stats.deaths === 0 ? stats.kills : parseFloat((stats.kills / stats.deaths).toFixed(2)),
        headHunter: stats.killBreakdown[playerWithMostKills] || 0,
        looseHunter: stats.killBreakdown[playerWithMostDeaths] || 0,
     }]);


    const getLeadClass = (stats: PlayerStats, key: keyof PlayerStats ) : string => {
        const value = stats[key];
        if (value === 0) return '';
        const max = Math.max(...data.map(([, s]) => s[key] as number));
        const secondMax = Math.max(...data.filter(([, s]) => (s[key] as number) < max).map(([, s]) => s[key] as number));
        const thirdMax = Math.max(...data.filter(([, s]) => (s[key] as number) < secondMax).map(([, s]) => s[key] as number));

        if (value === max && max !== secondMax) {
            return 'lead-highest';
        } else if (value === secondMax && max !== secondMax) {
            return 'lead-second-highest';
        } else if (value === thirdMax && secondMax !== thirdMax) {
            return 'lead-third-highest';
        }
        return '';
    }

    const getDataInOrder = () => {
        // @ts-ignore
        return data.sort(([, a], [, b]) => {
            if (orderBy === 'kdr') {
                return (b.kdr || 0) - (a.kdr || 0);
            } else {
                if (typeof a[orderBy] === 'number' && typeof b[orderBy] === 'number')
                return b[orderBy] - a[orderBy];
            }
            return 0;
        });
    }

    return (<div className='page' style={{ marginBottom: '20px' }}>
        <h3>Comprehensive Leaderboard 🏆</h3>
        <table style={{ borderCollapse: 'collapse', width: 'auto', fontSize: '14px' }}>
            <thead>
                <tr style={{ backgroundColor: '#eee' }}>
                    <th>Player</th>
                    <th className='sortable' onClick={() => setOrderBy('kills')}>Kills {orderBy === 'kills' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('kdr')}>KDR {orderBy === 'kdr' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('deaths')}>Deaths {orderBy === 'deaths' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('headHunter')}>Head Hunter {orderBy === 'headHunter' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('suicides')}>Wrong turn {orderBy === 'suicides' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('telefrags')}>Respawn Hero {orderBy === 'telefrags' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('grenadeKills')}>Grenadier {orderBy === 'grenadeKills' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('eventStreak')}>Troublemaker {orderBy === 'eventStreak' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('looseHunter')}>Bully {orderBy === 'looseHunter' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('blasterKills')}>Optimist {orderBy === 'blasterKills' ? '▼' : ''}</th>
                    <th>Specialist</th>
                </tr>
            </thead>
            <tbody>
                {getDataInOrder().map(([player, stats]) => (
                    <tr key={player}>
                        <td>{player}</td>
                        <td className={getLeadClass(stats, 'kills')}>{stats.kills}</td>
                        <td className={getLeadClass(stats, 'kdr')}>{stats.kdr}</td>
                        <td className={getLeadClass(stats, 'deaths')}>{stats.deaths}</td>
                        <td className={getLeadClass(stats, 'headHunter')}>{stats.headHunter}</td>
                        <td className={getLeadClass(stats, 'suicides')}>{stats.suicides}</td>
                        <td className={getLeadClass(stats, 'telefrags')}>{stats.telefrags}</td>
                        <td className={getLeadClass(stats, 'grenadeKills')}>{stats.grenadeKills}</td>
                        <td className={getLeadClass(stats, 'eventStreak')}>{stats.eventStreak}</td>
                        <td className={getLeadClass(stats, 'looseHunter')}>{stats.looseHunter}</td>
                        <td className={getLeadClass(stats, 'blasterKills')}>{stats.blasterKills}</td>

                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    )
}