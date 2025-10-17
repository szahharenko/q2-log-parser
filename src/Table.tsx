import { useState } from 'react';
import { PlayerStats } from './types';

interface PlayerTableProps {
    playerStats: Record<string, PlayerStats>;
}

export const PlayerTable = ({playerStats}: PlayerTableProps) => {
    const [orderBy, setOrderBy] = useState< 'kills' | 'deaths' | 'suicides' | 'grenadeKills' | 'telefrags' | 'kdr'>('kills');

    let data = Object.entries(playerStats).sort(([, a], [, b]) => b.kills - a.kills || a.deaths - b.deaths)
    if (data.length === 0) return null;
    data = data.map(([player, stats]) => [player, {
        ...stats,
        kdr: stats.deaths === 0 ? stats.kills : parseFloat((stats.kills / stats.deaths).toFixed(2))
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

    return (<div style={{ marginBottom: '20px' }}>
        <h3>Comprehensive Leaderboard 🏆</h3>
        <table style={{ borderCollapse: 'collapse', width: 'auto', fontSize: '14px' }}>
            <thead>
                <tr style={{ backgroundColor: '#eee' }}>
                    <th>Player</th>
                    <th className='sortable' onClick={() => setOrderBy('kills')}>Kills {orderBy === 'kills' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('deaths')}>Deaths {orderBy === 'deaths' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('kdr')}>KDR {orderBy === 'kdr' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('suicides')}>Suicides {orderBy === 'suicides' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('telefrags')}>Telefrags {orderBy === 'telefrags' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('grenadeKills')}>Grenade Kills {orderBy === 'grenadeKills' ? '▼' : ''}</th>
                </tr>
            </thead>
            <tbody>
                {getDataInOrder().map(([player, stats]) => (
                    <tr key={player}>
                        <td>{player}</td>
                        <td className={getLeadClass(stats.kills, maxKills, secondMaxKills, thirdMaxKills)}>{stats.kills}</td>
                        <td>{stats.deaths}</td>
                        <td className={getLeadClass(stats.kdr || 0, maxKDR, secondMaxKDR, thirdMaxKDR)}>{stats.kdr}</td>
                        <td className={getLeadClass(stats.suicides, maxSuicides, secondMaxSuicides, thirdMaxSuicides)}>{stats.suicides}</td>
                        <td className={getLeadClass(stats.telefrags, maxTelefrags, secondMaxTelefrags, thirdMaxTelefrags)}>{stats.telefrags}</td>
                        <td className={getLeadClass(stats.grenadeKills, maxGrenadeKills, secondMaxGrenadeKills, thirdMaxGrenadeKills)}>{stats.grenadeKills}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    )
}