import { useEffect, useState } from 'react';
import { GrenadeAchievement, HeadHunterAchievement, PlayerStats, TelefragAchievement, WrongTurnAchievement } from '../types/types';
import { calculateHeadHunter, calculateMostBlasterKills, calculateMostEventStreak, calculateMostGrenadeKills, calculateMostTelefrags, calculateNoMercyForMinions, calculateWrongTurn } from '../utils/functions';

interface AchievementsProps {
    playerStats: Record<string, PlayerStats>;
    weaponStats: Record<string, number> | null;
}

export const Achievements = ({playerStats, weaponStats}: AchievementsProps) => {

    const [headHunter, setHeadHunter] = useState<HeadHunterAchievement | null>(null);
    const [mostTelefrags, setMostTelefrags] = useState<TelefragAchievement | null>(null);
    const [wrongTurn, setWrongTurn] = useState<WrongTurnAchievement | null>(null);
    const [mostEventStreak, setMostEventStreak] = useState<WrongTurnAchievement | null>(null);
    const [mostBully, setMostBully] = useState<HeadHunterAchievement | null>(null);
    const [mostGrenades, setMostGrenades] = useState<GrenadeAchievement | null>(null);
    const [mostBlaster, setMostBlaster] = useState<GrenadeAchievement | null>(null);

    useEffect(() => {
        // Achievements
        setHeadHunter(calculateHeadHunter(playerStats));
        setMostTelefrags(calculateMostTelefrags(playerStats));
        setWrongTurn(calculateWrongTurn(playerStats));
        setMostGrenades(calculateMostGrenadeKills(playerStats));
        setMostBlaster(calculateMostBlasterKills(playerStats));
        setMostEventStreak(calculateMostEventStreak(playerStats));
        setMostBully(calculateNoMercyForMinions(playerStats));
    }, [playerStats]);

    return <>
      { /* Total weapon usage (killed by weapon) */}
      {weaponStats && (
        <div style={{ margin: '30px 0' }}>
            <h3>Combined weapon Usage Statistics 🔫 ({Object.values(weaponStats).reduce((a, b) => a + b, 0)})</h3>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {Object.entries(weaponStats)
                    .sort(([, a], [, b]) => b - a)
                    .map(([weapon, count]) => (
                        <li key={weapon}>
                            <strong>{weapon}</strong>: {count} {count > 1 ? 'kills' : 'kill'}
                        </li>
                    ))}
            </ul>
        </div>
      )}

      {/* Achievements */}
      {headHunter && (
        <div style={{ padding: '10px 15px', border: '1px solid #e0c200', backgroundColor: '#fffbe6', borderRadius: '5px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0 }}>🏆 Head Hunter</h3>
          <p style={{ margin: 0 }}>
            <strong>{headHunter.hunter}</strong> is the Head Hunter for killing the leader (<strong>{headHunter.leader}</strong>) {headHunter.killsOnLeader} {headHunter.killsOnLeader > 1 ? 'times' : 'time'}!
          </p>
        </div>
      )}

      {mostTelefrags && (
          <div style={{ padding: '10px 15px', border: '1px solid #6f42c1', backgroundColor: '#f3eefc', borderRadius: '5px', marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0 }}>🏅 Respawn Hero</h3>
            <p style={{ margin: 0 }}>
              <strong>{mostTelefrags.achievers.join(' & ')}</strong> {mostTelefrags.achievers.length > 1 ? 'share the award' : 'gets the award'} with <strong>{mostTelefrags.count}</strong> telefrags!
            </p>
          </div>
      )}

      {wrongTurn && (
        <div style={{ padding: '10px 15px', border: '1px solid #dc3545', backgroundColor: '#fbe9eb', borderRadius: '5px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0 }}>🤦 Wrong Turn</h3>
          <p style={{ margin: 0 }}>
            <strong>{wrongTurn.achievers.join(' & ')}</strong> took a wrong turn {wrongTurn.count} {wrongTurn.count > 1 ? 'times' : 'time'} to earn this award.
          </p>
        </div>
      )}

      {mostGrenades && (
          <div style={{ padding: '10px 15px', border: '1px solid #28a745', backgroundColor: '#e9f7ec', borderRadius: '5px', marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0 }}>💣 Grenadier</h3>
            <p style={{ margin: 0 }}>
              <strong>{mostGrenades.achievers.join(' & ')}</strong> earned the top spot with <strong>{mostGrenades.count}</strong> grenade kills!
            </p>
          </div>
      )}

      {mostEventStreak && (
        <div style={{ padding: '10px 15px', border: '1px solid #aea601ff', backgroundColor: '#feffadff', borderRadius: '5px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0 }}>🔥 Troublemaker</h3>
          <p style={{ margin: 0 }}>
            <strong>{mostEventStreak.achievers.join(' & ')}</strong> caused chaos with an event streak of <strong>{mostEventStreak.count}</strong>!
          </p>
        </div>
      )}

      { /*No Mercy for Minions */ }
      {mostBully && (
        <div style={{ padding: '10px 15px', border: '1px solid #ff5733', backgroundColor: '#ffe6e1', borderRadius: '5px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0 }}>👊 Bully</h3>
          <p style={{ margin: 0 }}>
            <strong>{mostBully.hunter}</strong> Has no mercy for Minions by killing <strong>{mostBully.leader}</strong> {mostBully.killsOnLeader} {mostBully.killsOnLeader > 1 ? 'times' : 'time'}!
          </p>
        </div>
      )}

      { /* Blaster kills achievement could be added here similarly */ }
      {mostBlaster && (
        <div style={{ padding: '10px 15px', border: '1px solid #17a2b8', backgroundColor: '#d1f0f7', borderRadius: '5px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0 }}>🔫 Optimist</h3>
          <p style={{ margin: 0 }}>
            <strong>{mostBlaster.achievers.join(' & ')}</strong> tops the charts with <strong>{mostBlaster.count}</strong> blaster kills!
          </p>
        </div>
      )}
    </>
}