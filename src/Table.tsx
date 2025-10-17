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
    const data = Object.entries(playerStats).sort(([, a], [, b]) => b.kills - a.kills || a.deaths - b.deaths)

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
                        <td style={styles.tdCenter}>{stats.kills}</td>
                        <td style={styles.tdCenter}>{stats.deaths}</td>
                        <td style={styles.tdCenter}>{ parseFloat(`${stats.kills/stats.deaths}`).toFixed(2) }</td>
                        <td style={styles.tdCenter}>{stats.suicides}</td>
                        <td style={styles.tdCenter}>{stats.telefrags}</td>
                        <td style={styles.tdCenter}>{stats.grenadeKills}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    )
}