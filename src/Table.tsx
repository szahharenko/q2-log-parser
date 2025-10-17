import { stat } from 'fs';
import { PlayerStats } from './types';

interface PlayerTableProps {
    playerStats: Record<string, PlayerStats>;
}

export const PlayerTable = ({playerStats}: PlayerTableProps) => {
    const styles = {
        th: {
            border: '1px solid #ccc',
            padding: '8px',
            textAlign: 'left' as const,
        },
        thCenter: {
            border: '1px solid #ccc',
            padding: '8px',
            textAlign: 'center' as const,
        },
        td: {
            border: '1px solid #ccc',
            padding: '8px',
        },
        tdCenter: {
            border: '1px solid #ccc',
            padding: '8px',
            textAlign: 'center' as const,
        },
    };
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
        else {
            return '';
        }
    }

    return (<div style={{ marginBottom: '20px' }}>
        <h3>Comprehensive Leaderboard 🏆</h3>
        <table style={{ borderCollapse: 'collapse', width: 'auto', fontSize: '14px' }}>
            <thead>
                <tr style={{ backgroundColor: '#eee' }}>
                    <th style={styles.th}>Player</th>
                    <th style={styles.thCenter}>Kills</th>
                    <th style={styles.thCenter}>Deaths</th>
                    <th style={styles.thCenter}>KDR</th>
                    <th style={styles.thCenter}>Suicides</th>
                    <th style={styles.thCenter}>Telefrags</th>
                    <th style={styles.thCenter}>Grenade Kills</th>
                </tr>
            </thead>
            <tbody>
                {data.map(([player, stats]) => (
                    <tr key={player}>
                        <td style={styles.td}>{player}</td>
                        <td style={styles.tdCenter} className={getLeadClass(stats.kills, maxKills, secondMaxKills, thirdMaxKills)}>{stats.kills}</td>
                        <td style={styles.tdCenter}>{stats.deaths}</td>
                        <td style={styles.tdCenter} className={getLeadClass(stats.kdr || 0, maxKDR, secondMaxKDR, thirdMaxKDR)}>{stats.kdr}</td>
                        <td style={styles.tdCenter} className={getLeadClass(stats.suicides, maxSuicides, secondMaxSuicides, thirdMaxSuicides)}>{stats.suicides}</td>
                        <td style={styles.tdCenter} className={getLeadClass(stats.telefrags, maxTelefrags, secondMaxTelefrags, thirdMaxTelefrags)}>{stats.telefrags}</td>
                        <td style={styles.tdCenter} className={getLeadClass(stats.grenadeKills, maxGrenadeKills, secondMaxGrenadeKills, thirdMaxGrenadeKills)}>{stats.grenadeKills}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    )
}