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

    // Determine max, second max, and third max for kills, KDR, deaths, and suicides
    const maxKills = Math.max(...data.map(([, stats]) => stats.kills));
    const secondMaxKills = Math.max(...data.filter(([, stats]) => stats.kills < maxKills).map(([, stats]) => stats.kills));
    const thirdMaxKills = Math.max(...data.filter(([, stats]) => stats.kills < secondMaxKills).map(([, stats]) => stats.kills));

    // kdr
    const maxKDR = Math.max(...data.map(([, stats]) => stats.kdr || 0));
    const secondMaxKDR = Math.max(...data.filter(([, stats]) => (stats.kdr || 0) < maxKDR).map(([, stats]) => stats.kdr || 0));
    const thirdMaxKDR = Math.max(...data.filter(([, stats]) => (stats.kdr || 0) < secondMaxKDR).map(([, stats]) => stats.kdr || 0));

    // suicides
    const maxSuicides = Math.max(...data.map(([, stats]) => stats.suicides));
    const secondMaxSuicides = Math.max(...data.filter(([, stats]) => stats.suicides < maxSuicides).map(([, stats]) => stats.suicides));
    const thirdMaxSuicides = Math.max(...data.filter(([, stats]) => stats.suicides < secondMaxSuicides).map(([, stats]) => stats.suicides));

    // grenade kills
    const maxGrenadeKills = Math.max(...data.map(([, stats]) => stats.grenadeKills));
    const secondMaxGrenadeKills = Math.max(...data.filter(([, stats]) => stats.grenadeKills < maxGrenadeKills).map(([, stats]) => stats.grenadeKills));
    const thirdMaxGrenadeKills = Math.max(...data.filter(([, stats]) => stats.grenadeKills < secondMaxGrenadeKills).map(([, stats]) => stats.grenadeKills));

    //telefrags
    const maxTelefrags = Math.max(...data.map(([, stats]) => stats.telefrags));
    const secondMaxTelefrags = Math.max(...data.filter(([, stats]) => stats.telefrags < maxTelefrags).map(([, stats]) => stats.telefrags));
    const thirdMaxTelefrags = Math.max(...data.filter(([, stats]) => stats.telefrags < secondMaxTelefrags).map(([, stats]) => stats.telefrags));

    //eventStreak
     const maxEventStreak = Math.max(...data.map(([, stats]) => stats.eventStreak));
     const secondMaxEventStreak = Math.max(...data.filter(([, stats]) => stats.eventStreak < maxEventStreak).map(([, stats]) => stats.eventStreak));
     const thirdMaxEventStreak = Math.max(...data.filter(([, stats]) => stats.eventStreak < secondMaxEventStreak).map(([, stats]) => stats.eventStreak));

    //headHunter
    const maxHeadHunter = Math.max(...data.map(([, stats]) => stats.headHunter));
    const secondMaxHeadHunter = Math.max(...data.filter(([, stats]) => stats.headHunter < maxHeadHunter).map(([, stats]) => stats.headHunter));
    const thirdMaxHeadHunter = Math.max(...data.filter(([, stats]) => stats.headHunter < secondMaxHeadHunter).map(([, stats]) => stats.headHunter));

    //looseHunter
    const maxLooseHunter = Math.max(...data.map(([, stats]) => stats.looseHunter));
    const secondMaxLooseHunter = Math.max(...data.filter(([, stats]) => stats.looseHunter < maxLooseHunter).map(([, stats]) => stats.looseHunter));
    const thirdMaxLooseHunter = Math.max(...data.filter(([, stats]) => stats.looseHunter < secondMaxLooseHunter).map(([, stats]) => stats.looseHunter));

    //blasterKills
    const maxBlasterKills = Math.max(...data.map(([, stats]) => stats.blasterKills));
    const secondMaxBlasterKills = Math.max(...data.filter(([, stats]) => stats.blasterKills < maxBlasterKills).map(([, stats]) => stats.blasterKills));
    const thirdMaxBlasterKills = Math.max(...data.filter(([, stats]) => stats.blasterKills < secondMaxBlasterKills).map(([, stats]) => stats.blasterKills));


    const getLeadClass = (value: number, max: number, secondmax: number, thirdmax: number) => {
        if (value === max && max !== secondmax) {
            return 'lead-highest';
        } else if (value === secondmax && max !== secondmax) {
            return 'lead-secondhighest';
        } else if (value === thirdmax && secondmax !== thirdmax) {
            return 'lead-thirdhighest';
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
                </tr>
            </thead>
            <tbody>
                {getDataInOrder().map(([player, stats]) => (
                    <tr key={player}>
                        <td>{player}</td>
                        <td className={getLeadClass(stats.kills, maxKills, secondMaxKills, thirdMaxKills)}>{stats.kills}</td>
                        <td className={getLeadClass(stats.kdr || 0, maxKDR, secondMaxKDR, thirdMaxKDR)}>{stats.kdr}</td>
                        <td>{stats.deaths}</td>
                        <td className={getLeadClass(stats.headHunter, maxHeadHunter, secondMaxHeadHunter, thirdMaxHeadHunter)}>{stats.headHunter}</td>
                        <td className={getLeadClass(stats.suicides, maxSuicides, secondMaxSuicides, thirdMaxSuicides)}>{stats.suicides}</td>
                        <td className={getLeadClass(stats.telefrags, maxTelefrags, secondMaxTelefrags, thirdMaxTelefrags)}>{stats.telefrags}</td>
                        <td className={getLeadClass(stats.grenadeKills, maxGrenadeKills, secondMaxGrenadeKills, thirdMaxGrenadeKills)}>{stats.grenadeKills}</td>
                        <td className={getLeadClass(stats.eventStreak, maxEventStreak, secondMaxEventStreak, thirdMaxEventStreak)}>{stats.eventStreak}</td>
                        <td className={getLeadClass(stats.looseHunter, maxLooseHunter, secondMaxLooseHunter, thirdMaxLooseHunter)}>{stats.looseHunter}</td>
                        <td className={getLeadClass(stats.blasterKills, maxBlasterKills, secondMaxBlasterKills, thirdMaxBlasterKills)}>{stats.blasterKills}</td>

                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    )
}