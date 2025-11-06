import { useState } from 'react';
import { PlayerStats } from '../types/types';
import { getLanguage } from '../utils/getLanguage';
import { getPlayer } from '../utils/getPlayer';
import { type Weapon } from '../utils/functions'

interface WeaponTableProps {
    playerStats: Record<string, PlayerStats>;
}

//'Railgun' | 'Rocket Launcher' | 'Machinegun' | 'Chaingun' | 'Super Shotgun' | 'Hyperblaster' | 'BFG' | 'Grenade' | 'Telefrag' | 'Shotgun' | 'Blaster';

export const WeaponTable = ({playerStats}: WeaponTableProps) => {
    //key of Weapon
    const [orderBy, setOrderBy] = useState<Weapon>('Railgun') ;
    const lang = getLanguage();
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('r');
    const activePlayer = getPlayer();

    let data = Object.entries(playerStats).sort(([, a], [, b]) => b.weaponKillsBreakdown.Railgun - a.weaponKillsBreakdown.Railgun || a.weaponKillsBreakdown.BFG - b.weaponKillsBreakdown.BFG)
    if (data.length === 0) return null;
    data = data.map(([player, stats]) => [player, {
        ...stats,
     }]);

    const getLeadClass = (stats: PlayerStats, key: Weapon ) : string => {
        const { weaponKillsBreakdown } = stats;
        let value = weaponKillsBreakdown[key];
        if (value === 0) return '';
        const max = Math.max(...data.map(([, s]) => s.weaponKillsBreakdown[key] as number));
        const secondMax = Math.max(...data.filter(([, s]) => (s.weaponKillsBreakdown[key] as number) < max).map(([, s]) => s.weaponKillsBreakdown[key] as number));
        const thirdMax = Math.max(...data.filter(([, s]) => (s.weaponKillsBreakdown[key] as number) < secondMax).map(([, s]) => s.weaponKillsBreakdown[key] as number));

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
            return b.weaponKillsBreakdown[orderBy] - a.weaponKillsBreakdown[orderBy];
        });
    }

    const openPlayer = (player: string) => () => {
        //add query parameter ?player= and redirect to that page
        const url = new URL(window.location.href);
        url.searchParams.set('player', player);
        window.location.href = url.toString();
    }

    return (<div className='wide-data page' style={{ marginBottom: '20px' }}>
        {
            lang === 'en' ?
            <h3>Weapon usage board</h3>:
            <h3>Используемое оружие</h3>
        }
        <table style={{ borderCollapse: 'collapse', width: 'auto', fontSize: '14px' }}>
            <thead>
                <tr style={{ backgroundColor: '#eee' }}>
                    <th>Player</th>

                    <th className='sortable' onClick={() => setOrderBy('Railgun')}>Railgun {orderBy === 'Railgun' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('BFG')}>BFG {orderBy === 'BFG' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('Rocket Launcher')}>Rocket Launcher {orderBy === 'Rocket Launcher' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('Chaingun')}>Chaingun {orderBy === 'Chaingun' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('Super Shotgun')}>Super Shotgun {orderBy === 'Super Shotgun' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('Hyperblaster')}>Hyperblaster {orderBy === 'Hyperblaster' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('Machinegun')}>Machinegun {orderBy === 'Machinegun' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('Grenade')}>Grenade {orderBy === 'Grenade' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('Shotgun')}>Shotgun {orderBy === 'Shotgun' ? '▼' : ''}</th>
                    <th className='sortable' onClick={() => setOrderBy('Blaster')}>Blaster {orderBy === 'Blaster' ? '▼' : ''}</th>


                </tr>
            </thead>
            <tbody>
                {getDataInOrder().map(([player, stats]) => (
                    (activePlayer ? activePlayer === player.toLocaleLowerCase() : true) &&
                    <tr key={player}>
                        <td style={ !reportId || activePlayer ? {} : {textDecoration: 'underline', cursor: 'pointer'}} onClick={  !reportId || activePlayer ? () => null : openPlayer(player)}>{player}</td>
                        <td className={getLeadClass(stats, 'Railgun')}>{stats.weaponKillsBreakdown['Railgun']}</td>
                        <td className={getLeadClass(stats, 'BFG')}>{stats.weaponKillsBreakdown['BFG']}</td>
                        <td className={getLeadClass(stats, 'Rocket Launcher')}>{stats.weaponKillsBreakdown['Rocket Launcher']}</td>
                        <td className={getLeadClass(stats, 'Chaingun')}>{stats.weaponKillsBreakdown['Chaingun']}</td>
                        <td className={getLeadClass(stats, 'Super Shotgun')}>{stats.weaponKillsBreakdown['Super Shotgun']}</td>
                        <td className={getLeadClass(stats, 'Hyperblaster')}>{stats.weaponKillsBreakdown['Hyperblaster']}</td>
                        <td className={getLeadClass(stats, 'Machinegun')}>{stats.weaponKillsBreakdown['Machinegun']}</td>
                        <td className={getLeadClass(stats, 'Grenade')}>{stats.weaponKillsBreakdown['Grenade']}</td>
                        <td className={getLeadClass(stats, 'Shotgun')}>{stats.weaponKillsBreakdown['Shotgun']}</td>
                        <td className={getLeadClass(stats, 'Blaster')}>{stats.weaponKillsBreakdown['Blaster']}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    )
}