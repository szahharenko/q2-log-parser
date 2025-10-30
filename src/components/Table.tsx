import { useState } from 'react';
import { PlayerStats } from '../types/types';
import { getLanguage } from '../utils/getLanguage';
import { getPlayer } from '../utils/getPlayer';

interface PlayerTableProps {
    playerStats: Record<string, PlayerStats>;
}

export const PlayerTable = ({playerStats}: PlayerTableProps) => {
    const [orderBy, setOrderBy] = useState< 'kills' | 'deaths' | 'suicides' | 'grenadeKills' | 'telefrags' | 'kdr' | 'eventStreak' | 'headHunter' | 'looseHunter' | 'blasterKills' | 'chatCount' | 'quadsPicked'>('kills') ;
    const lang = getLanguage();
    const activePlayer = getPlayer();


    let data = Object.entries(playerStats).sort(([, a], [, b]) => b.kills - a.kills || a.deaths - b.deaths)
    if (data.length === 0) return null;
    const playerWithMostKills = data[0][0];
    const playerWithMostDeaths = data.sort(([, a], [, b]) => b.deaths - a.deaths)[0][0];
    data = data.map(([player, stats]) => [player, {
        ...stats,
        kdr: stats.deaths === 0 ? stats.kills : parseFloat((stats.kills / stats.deaths).toFixed(2)),
        headHunter: stats.killBreakdown[playerWithMostKills] || 0,
        looseHunter: stats.killBreakdown[playerWithMostDeaths] || 0,
        chatCount: stats.chats.length || 0,
     }]);


    const getLeadClass = (stats: PlayerStats, key: keyof PlayerStats ) : string => {
        let value = stats[key];
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

    const openPlayer = (player: string) => () => {
        //add query parameter ?player= and redirect to that page
        const url = new URL(window.location.href);
        url.searchParams.set('player', player);
        window.location.href = url.toString();
    }

    const backToList = (e: React.MouseEvent) => {
        //remove query parameter ?player= and redirect to that page
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.delete('player');
        window.location.href = url.toString();
    }


    return (<div className='page' style={{ marginBottom: '20px' }}>
        {
            activePlayer ?
            <>
                <button onClick={backToList}>{ lang === 'en' ? 'Return to full report' : 'Полный отчет'}</button>
                <h1>{activePlayer}</h1>
            </>:
            lang === 'en' ?
            <h3>Comprehensive Leaderboard 🏆</h3>:
            <h3>Подробная таблица лидеров 🏆</h3>
        }



        <table style={{ borderCollapse: 'collapse', width: 'auto', fontSize: '14px' }}>
            <thead>
                <tr style={{ backgroundColor: '#eee' }}>
                    <th>Player</th>
                    <th className='sortable' onClick={() => setOrderBy('kills')}>{ lang === 'en' ? 'Kills' : 'Убийств'} {orderBy === 'kills' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('kdr')}>KDR {orderBy === 'kdr' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('deaths')}>{ lang === 'en' ? 'Deaths' : 'Смерти'} {orderBy === 'deaths' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('quadsPicked')}>{ lang === 'en' ? 'Quads' : 'Квады'} {orderBy === 'quadsPicked' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('headHunter')}>Head Hunter {orderBy === 'headHunter' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('suicides')}>Wrong turn {orderBy === 'suicides' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('telefrags')}>Respawn Hero {orderBy === 'telefrags' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('grenadeKills')}>Grenadier {orderBy === 'grenadeKills' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('eventStreak')}>Troublemaker {orderBy === 'eventStreak' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('looseHunter')}>Zero tolerance {orderBy === 'looseHunter' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('blasterKills')}>{ lang === 'en' ? 'Optimist' : 'Оптимист'} {orderBy === 'blasterKills' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('chatCount')}>Chat lord {orderBy === 'chatCount' ? '▼' : ''}</th>
                </tr>
            </thead>
            <tbody>
                {getDataInOrder().map(([player, stats]) => (
                    (activePlayer ? activePlayer === player : true) &&
                    <tr key={player}>
                        <td style={activePlayer ? {} : {textDecoration: 'underline', cursor: 'pointer'}} onClick={ activePlayer ? () => null : openPlayer(player)}>{player}</td>
                        <td className={getLeadClass(stats, 'kills')}>{stats.kills}</td>
                        <td className={getLeadClass(stats, 'kdr')}>{stats.kdr}</td>
                        <td className={getLeadClass(stats, 'deaths')}>{stats.deaths}</td>
                        <td className={getLeadClass(stats, 'quadsPicked')}>{stats.quadsPicked}</td>
                        <td className={getLeadClass(stats, 'headHunter')}>{stats.headHunter}</td>
                        <td className={getLeadClass(stats, 'suicides')}>{stats.suicides}</td>
                        <td className={getLeadClass(stats, 'telefrags')}>{stats.telefrags}</td>
                        <td className={getLeadClass(stats, 'grenadeKills')}>{stats.grenadeKills}</td>
                        <td className={getLeadClass(stats, 'eventStreak')}>{stats.eventStreak}</td>
                        <td className={getLeadClass(stats, 'looseHunter')}>{stats.looseHunter}</td>
                        <td className={getLeadClass(stats, 'blasterKills')}>{stats.blasterKills}</td>
                        <td className={getLeadClass(stats, 'chatCount')}>{stats.chatCount}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    )
}