import { useEffect, useState } from 'react';
import { HeadHunterAchievement, PlayerStats, Achievement } from '../types/types';
import { calculateHeadHunter, calculateMostBlasterKills, calculateMostChats, calculateMostEventStreak, calculateMostGrenadeKills, calculateMostTelefrags, calculateNoMercyForMinions, calculateSpecialist, calculateWrongTurn, getLeastUsedWeapon } from '../utils/functions';
import tet from '../img/tet.jpg'; // Tell webpack this JS file uses this image
import { getLanguage } from '../utils/getLanguage';

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
    const [mostChats, setMostChats] = useState<Achievement | null>(null);
    const lang = getLanguage();


    useEffect(() => {
        setHeadHunter(calculateHeadHunter(playerStats));
        setMostTelefrags(calculateMostTelefrags(playerStats));
        setWrongTurn(calculateWrongTurn(playerStats));
        setMostGrenades(calculateMostGrenadeKills(playerStats));
        setMostBlaster(calculateMostBlasterKills(playerStats));
        setMostEventStreak(calculateMostEventStreak(playerStats));
        setMostBully(calculateNoMercyForMinions(playerStats));
        setMostChats(calculateMostChats(playerStats));
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

        <h3>{ lang === 'en' ? 'Prize Pool 🏆💰 Achievements' : 'Призовые 🏆💰 Ачивки'}</h3>
        <div className='achievements-list page'>

          {headHunter && (
            <div style={{  border: '1px solid #e0c200', backgroundColor: '#fffbe6' }}>
              <h3 >🏆 Head Hunter</h3>
              { lang === 'en' ?
                <p>
                  <strong>{headHunter.hunter}</strong> is the Head Hunter for killing the leader (<strong>{headHunter.leader}</strong>) {headHunter.killsOnLeader} {headHunter.killsOnLeader > 1 ? 'times' : 'time'}!
                </p>
                :
                <p>
                  <strong>{headHunter.hunter}</strong> — охотник за головами, убивший лидера (<strong>{headHunter.leader}</strong>) убив его {headHunter.killsOnLeader} раз!
                </p>
              }
            </div>
          )}

          {mostTelefrags && (
              <div style={{  border: '1px solid #6f42c1', backgroundColor: '#f3eefc' }}>
                <h3 >🏅 Respawn Hero</h3>
                { lang === 'en' ?
                  <p>
                    <strong>{mostTelefrags.achievers.join(' & ')}</strong> {mostTelefrags.achievers.length > 1 ? 'share the award' : 'gets the award'} with <strong>{mostTelefrags.count}</strong> telefrags!
                  </p>
                  :
                  <p>
                    <strong>{mostTelefrags.achievers.join(' & ')}</strong> {mostTelefrags.achievers.length > 1 ? 'делят награду' : 'получает награду'} с <strong>{mostTelefrags.count}</strong> телефрагами!
                  </p>
                }
              </div>
          )}

          {wrongTurn && (
            <div style={{  border: '1px solid #dc3545', backgroundColor: '#fbe9eb' }}>
              <h3 >🤦 Wrong Turn</h3>
              { lang === 'en' ?
                <p>
                  <strong>{wrongTurn.achievers.join(' & ')}</strong> took a wrong turn {wrongTurn.count} {wrongTurn.count > 1 ? 'times' : 'time'} to earn this award.
                </p>
                :
                <p>
                  Чтобы получить эту награду, <strong>{wrongTurn.achievers.join(' & ')}</strong> {wrongTurn.count} раз свернул не туда.
                </p>
              }
            </div>
          )}
          {mostGrenades && (
              <div style={{  border: '1px solid #28a745', backgroundColor: '#e9f7ec', }}>
              <h3 >💣 Grenadier</h3> Гренадер
              { lang === 'en' ?
                <p>
                  <strong>{mostGrenades.achievers.join(' & ')}</strong> earned the top spot with <strong>{mostGrenades.count}</strong> grenade kills!
                </p>
                :
                <p>
                  <strong>{mostGrenades.achievers.join(' & ')}</strong> занял первое место, совершив <strong>{mostGrenades.count}</strong> убийства гранатами!
                </p>
              }
              </div>
          )}

          {mostEventStreak && (
            <div style={{  border: '1px solid #aea601ff', backgroundColor: '#feffadff' }}>
              <h3 >🔥 Troublemaker</h3>Нарушитель спокойствия
              { lang === 'en' ?
                <p>
                  <strong>{mostEventStreak.achievers.join(' & ')}</strong> caused chaos with an event streak of <strong>{mostEventStreak.count}</strong>!
                </p>
                :
                <p>
                  <strong>{mostEventStreak.achievers.join(' & ')}</strong> вызвал хаос с серией событий длинной в <strong>{mostEventStreak.count}</strong>!
                </p>
              }

            </div>
          )}

        </div>
        <h3>{ lang === 'en' ? 'Bonus 🏆🌟 Achievements' : 'Бонусные 🏆🌟 Ачивки'}</h3>
        <div className='achievements-list page'>
          {mostBully && (
            <div style={{  border: '1px solid #ff5733', backgroundColor: '#ffe6e1' }}>
              { lang === 'en' ?
                <h3 >👊 Bully</h3>
                :
                <h3 >👊 Задира</h3>
              }
              { lang === 'en' ?
                <p>
                  <strong>{mostBully.hunter}</strong> Has no mercy for weakest by killing <strong>{mostBully.leader}</strong> {mostBully.killsOnLeader} {mostBully.killsOnLeader > 1 ? 'times' : 'time'}!
                </p>
                :
                <p>
                  <strong>{mostBully.hunter}</strong> не щадит самых слабых, убив <strong>{mostBully.leader}</strong> {mostBully.killsOnLeader} раз!
                </p>
              }
            </div>
          )}

          { /* Blaster kills achievement could be added here similarly */ }
          {mostBlaster && (
            <div style={{  border: '1px solid #17a2b8', backgroundColor: '#d1f0f7' }}>
              { lang === 'en' ?
                <>
                  <h3>🔫 Optimist</h3>
                  <p>
                    <strong>{mostBlaster.achievers.join(' & ')}</strong> tops the charts with <strong>{mostBlaster.count}</strong> blaster kills!
                  </p>
                </>
                :
                <>
                  <h3>🔫 Оптимист</h3>
                  <p>
                    <strong>{mostBlaster.achievers.join(' & ')}</strong> возглавляет чарты, убив <strong>{mostBlaster.count}</strong> противников из бластера!
                  </p>
                </>
              }
            </div>
          )}

          { /* Player with moskt kills from Least used weapon */}
          {
            leastUsedWeapon && (
              <div style={{  border: '1px solid #795548', backgroundColor: '#f5f0ed' }}>
              { lang === 'en' ?
                specialist && <>
                  <h3>🔪 Specialist</h3>
                  <p>
                    <strong>{specialist.player}</strong> mastered the <strong>{specialist.weapon}</strong> with <strong>{specialist.kills}</strong> kills, the least used weapon with only <strong>{leastUsedWeapon.count}</strong> total kills!
                  </p>
                </>
                :
                specialist && <>
                  <h3>🔪 Специалист</h3>
                  <p>
                    <strong>{specialist.player}</strong> освоил <strong>{specialist.weapon}</strong>, совершив <strong>{specialist.kills}</strong> убийств — это наименее используемое оружие, с которым было совершено всего <strong>{leastUsedWeapon.count}</strong> убийств!
                  </p>
                </>
              }
              </div>
            )
          }

          { /* Player who speaks to much */}
          {
            mostChats && (
              <div style={{  border: '1px solid #009688', backgroundColor: '#e0f2f1' }}>
                { lang === 'en' ?
                  <>
                    <h3>💬 Chatterbox</h3>
                    <p><strong>{mostChats.achievers.join(' & ')}</strong> leads the chatter with <strong>{mostChats.count}</strong> chat messages!</p>
                  </>
                  :
                  <>
                    <h3>💬 Болтун</h3>
                    <p><strong>{mostChats.achievers.join(' & ')}</strong> лидирует в чате с <strong>{mostChats.count}</strong> сообщениями!</p>
                  </>
                }
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
              <strong>персональная ачивка tet (spacer) </strong>
              <h3>😤😒 Д`Артаньян</h3>

              <p>Читеры замешанные в деле</p>
              <ul>
              {
                tetKillers.sort((a, b) => b.killsOnTet - a.killsOnTet).map(({ player, killsOnTet }) => {
                  return killsOnTet === 0 ? null : <li key={player}>
                    <strong>{player}</strong> нечестно убил tet-а <strong>{killsOnTet}</strong> раза
                  </li>
                })
              }
              </ul>
            </div>
          </div>
        )
      }
    </>
}