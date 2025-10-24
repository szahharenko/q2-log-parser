import { useEffect, useState } from 'react';
import { HeadHunterAchievement, PlayerStats, Achievement } from '../types/types';
import { calculateHeadHunter, calculateMostBlasterKills, calculateMostEventStreak, calculateMostGrenadeKills, calculateMostTelefrags, calculateNoMercyForMinions, calculateSpecialist, calculateWrongTurn, getLeastUsedWeapon } from '../utils/functions';
import tet from '../img/tet.jpg'; // Tell webpack this JS file uses this image
import { json } from 'stream/consumers';


interface AchievementsProps {
    playerStats: Record<string, PlayerStats>;
    weaponStats: Record<string, number> | null;
    nonGameEvents?: string[];
}

export const Achievements = ({playerStats, weaponStats, nonGameEvents}: AchievementsProps) => {

    const [headHunter, setHeadHunter] = useState<HeadHunterAchievement | null>(null);
    const [mostTelefrags, setMostTelefrags] = useState<Achievement | null>(null);
    const [wrongTurn, setWrongTurn] = useState<Achievement | null>(null);
    const [mostEventStreak, setMostEventStreak] = useState<Achievement | null>(null);
    const [mostBully, setMostBully] = useState<HeadHunterAchievement | null>(null);
    const [mostGrenades, setMostGrenades] = useState<Achievement | null>(null);
    const [mostBlaster, setMostBlaster] = useState<Achievement | null>(null);
    const [leastUsedWeapon, setLeastUsedWeapon] = useState<{ weapon: string; count: number } | null>(null);
    const [specialist, setSpecialist] = useState<{ player: string; weapon: string; kills: number } | null>(null);
    const [tetKillers, setTetKiller] = useState<{ player: string; killsOnTet: number }[] | null>(null);

    useEffect(() => {
        setHeadHunter(calculateHeadHunter(playerStats));
        setMostTelefrags(calculateMostTelefrags(playerStats));
        setWrongTurn(calculateWrongTurn(playerStats));
        setMostGrenades(calculateMostGrenadeKills(playerStats));
        setMostBlaster(calculateMostBlasterKills(playerStats));
        setMostEventStreak(calculateMostEventStreak(playerStats));
        setMostBully(calculateNoMercyForMinions(playerStats));
    }, [playerStats, weaponStats]);

    useEffect(() => {
      const hasTet = Object.keys(playerStats).some(name => name.toLowerCase().includes('tet'));
      if (hasTet) {
        const tetKillers = Object.entries(playerStats).map(([player, stats]) => ({
          player, killsOnTet: stats.killBreakdown['tet'] || 0
        }));

        setTetKiller(tetKillers);
      }
    }, [playerStats]);

    useEffect(() => {
        const leastUsedWeapon = getLeastUsedWeapon(weaponStats);
        setLeastUsedWeapon(leastUsedWeapon);
        playerStats && leastUsedWeapon && setSpecialist(calculateSpecialist(leastUsedWeapon?.weapon, playerStats));
    }, [playerStats, weaponStats]);

    return <>
      <div className='page' style={{ margin: '30px 0' }}>
        {/* title for achievements */}
        <h3>Achievements 🏆</h3>
        <div className='achievements-list page'>
          {/* Achievements */}
          {headHunter && (
            <div style={{  border: '1px solid #e0c200', backgroundColor: '#fffbe6' }}>
              <h3 >🏆 Head Hunter</h3>
              <p>
                <strong>{headHunter.hunter}</strong> is the Head Hunter for killing the leader (<strong>{headHunter.leader}</strong>) {headHunter.killsOnLeader} {headHunter.killsOnLeader > 1 ? 'times' : 'time'}!
              </p>
            </div>
          )}

          {mostTelefrags && (
              <div style={{  border: '1px solid #6f42c1', backgroundColor: '#f3eefc' }}>
                <h3 >🏅 Respawn Hero</h3>
                <p>
                  <strong>{mostTelefrags.achievers.join(' & ')}</strong> {mostTelefrags.achievers.length > 1 ? 'share the award' : 'gets the award'} with <strong>{mostTelefrags.count}</strong> telefrags!
                </p>
              </div>
          )}

          {wrongTurn && (
            <div style={{  border: '1px solid #dc3545', backgroundColor: '#fbe9eb' }}>
              <h3 >🤦 Wrong Turn</h3>
              <p>
                <strong>{wrongTurn.achievers.join(' & ')}</strong> took a wrong turn {wrongTurn.count} {wrongTurn.count > 1 ? 'times' : 'time'} to earn this award.
              </p>
            </div>
          )}

          {mostGrenades && (
              <div style={{  border: '1px solid #28a745', backgroundColor: '#e9f7ec', }}>
                <h3 >💣 Grenadier</h3>
                <p>
                  <strong>{mostGrenades.achievers.join(' & ')}</strong> earned the top spot with <strong>{mostGrenades.count}</strong> grenade kills!
                </p>
              </div>
          )}

          {mostEventStreak && (
            <div style={{  border: '1px solid #aea601ff', backgroundColor: '#feffadff' }}>
              <h3 >🔥 Troublemaker</h3>
              <p>
                <strong>{mostEventStreak.achievers.join(' & ')}</strong> caused chaos with an event streak of <strong>{mostEventStreak.count}</strong>!
              </p>
            </div>
          )}

          { /*No Mercy for Minions */ }
          {mostBully && (
            <div style={{  border: '1px solid #ff5733', backgroundColor: '#ffe6e1' }}>
              <h3 >👊 Bully</h3>
              <p>
                <strong>{mostBully.hunter}</strong> Has no mercy for Minions by killing <strong>{mostBully.leader}</strong> {mostBully.killsOnLeader} {mostBully.killsOnLeader > 1 ? 'times' : 'time'}!
              </p>
            </div>
          )}

          { /* Blaster kills achievement could be added here similarly */ }
          {mostBlaster && (
            <div style={{  border: '1px solid #17a2b8', backgroundColor: '#d1f0f7' }}>
              <h3>🔫 Optimist</h3>
              <p>
                <strong>{mostBlaster.achievers.join(' & ')}</strong> tops the charts with <strong>{mostBlaster.count}</strong> blaster kills!
              </p>
            </div>
          )}

          { /* Player with moskt kills from Least used weapon */}
          {
            leastUsedWeapon && (
              <div style={{  border: '1px solid #795548', backgroundColor: '#f5f0ed' }}>
                <h3>🔪 Specialist</h3>
                {specialist ? (
                  <p>
                    <strong>{specialist.player}</strong> mastered the <strong>{specialist.weapon}</strong> with <strong>{specialist.kills}</strong> kills, the least used weapon with only <strong>{leastUsedWeapon.count}</strong> total kills!
                  </p>
                ) : (
                  <p>No player achieved kills with the least used weapon: <strong>{leastUsedWeapon.weapon}</strong>.</p>
                )}
              </div>
            )
          }
        </div>
      </div>
      {
        tetKillers && (
          <div className='tet-details' style={{  border: '1px solid #ff9800', backgroundColor: '#fff3e0' }}>
            <div><img src={tet} alt='tet'/></div>
            <div>
              <h3>😤😒 Д`Артаньян</h3>
              <p>Cheater list</p>
              <ul>
              {
                tetKillers.sort((a, b) => b.killsOnTet - a.killsOnTet).map(({ player, killsOnTet }) => {
                  return killsOnTet === 0 ? null : <li key={player}>
                    <strong>{player}</strong> cheated <strong>{killsOnTet}</strong> times on tet
                  </li>
                })
              }
              </ul>
              { JSON.stringify(nonGameEvents?.filter(line => line.toLowerCase().includes('tet') || line.toLocaleLowerCase().includes('spacer'))) }
              {tetKillers.every(({ killsOnTet }) => killsOnTet === 0) && <div>No one cheated on Tet. Well done!</div>}
            </div>
          </div>
        )
      }
    </>
}