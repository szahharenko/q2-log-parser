import { useEffect, useState } from 'react';
import { GrenadeAchievement, HeadHunterAchievement, PlayerStats, TelefragAchievement, WrongTurnAchievement } from '../types/types';
import { calculateHeadHunter, calculateMostBlasterKills, calculateMostEventStreak, calculateMostGrenadeKills, calculateMostTelefrags, calculateNoMercyForMinions, calculateWrongTurn } from '../utils/functions';

interface AchievementsProps {
    playerStats: Record<string, PlayerStats>;
}

export const Achievements = ({playerStats}: AchievementsProps) => {

    const [headHunter, setHeadHunter] = useState<HeadHunterAchievement | null>(null);
    const [mostTelefrags, setMostTelefrags] = useState<TelefragAchievement | null>(null);
    const [wrongTurn, setWrongTurn] = useState<WrongTurnAchievement | null>(null);
    const [mostEventStreak, setMostEventStreak] = useState<WrongTurnAchievement | null>(null);
    const [mostBully, setMostBully] = useState<HeadHunterAchievement | null>(null);
    const [mostGrenades, setMostGrenades] = useState<GrenadeAchievement | null>(null);
    const [mostBlaster, setMostBlaster] = useState<GrenadeAchievement | null>(null);

    useEffect(() => {
        setHeadHunter(calculateHeadHunter(playerStats));
        setMostTelefrags(calculateMostTelefrags(playerStats));
        setWrongTurn(calculateWrongTurn(playerStats));
        setMostGrenades(calculateMostGrenadeKills(playerStats));
        setMostBlaster(calculateMostBlasterKills(playerStats));
        setMostEventStreak(calculateMostEventStreak(playerStats));
        setMostBully(calculateNoMercyForMinions(playerStats));
    }, [playerStats]);

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
        </div>
      </div>
    </>
}